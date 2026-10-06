import { type AuthMeResponse } from '@/route-handlers/auth-me/auth-me.types';
import { getQueryClient } from '@/utils/query-client/query-client';

import { AUTH_LOOP_MARKER_PARAM, AUTH_NOTICE_PARAM } from '../auth.constants';
import { type AuthRecoveryResult } from '../auth.types';

import {
  AUTH_RECOVERY_INVALIDATION_QUERY_KEYS,
  AUTH_RECOVERY_LOCK_NAME,
} from './auth-recovery.constants';
import { type HandleApiUnauthorizedContext } from './handle-api-unauthorized.types';

let recoveryInFlight: Promise<AuthRecoveryResult | undefined> | null = null;

/**
 * Called by request() on a 401. Recovers the session once per tab and across
 * tabs (Web Locks), then refreshes auth-related queries or redirects.
 * Resolves undefined when recovery fails, so the caller's 401 stands.
 */
export async function handleApiUnauthorized(
  ctx: HandleApiUnauthorizedContext
): Promise<AuthRecoveryResult | undefined> {
  // Concurrent 401s in a tab share one recovery. It is cleared before the
  // invalidation below, because invalidating refetches queries, a refetch can
  // 401 and re-enter here, and joining the recovery it is part of would hang.
  const isOwner = recoveryInFlight === null;
  const inFlight = (recoveryInFlight ??= runSerializedRecovery(ctx).finally(
    () => {
      recoveryInFlight = null;
    }
  ));
  const result = await inFlight;

  if (result?.kind === 'redirect') {
    // Only the caller that started the recovery navigates.
    if (isOwner) {
      window.location.assign(buildRecoveryRedirectUrl(result));
    }
    return suspendForever();
  }

  // Invalidate once per recovery, not per caller: each invalidation cancels
  // in-flight refetches, so N callers would cancel each other's auth-me fetch.
  if (result?.kind === 'recovered' && isOwner) {
    await invalidatePostRecovery();
  }
  return result;
}

async function runSerializedRecovery(
  ctx: HandleApiUnauthorizedContext
): Promise<AuthRecoveryResult | undefined> {
  // Without Web Locks (old browsers, jsdom) recover directly. Two tabs may
  // then recover at once; the server-side freshness check covers that.
  if (typeof navigator.locks === 'undefined') {
    return recoverOnce(ctx);
  }
  try {
    return await navigator.locks.request(AUTH_RECOVERY_LOCK_NAME, () =>
      recoverOnce(ctx)
    );
  } catch {
    // Lock failed, so skip recovery and let the caller's 401 stand.
    return undefined;
  }
}

async function recoverOnce(
  ctx: HandleApiUnauthorizedContext
): Promise<AuthRecoveryResult | undefined> {
  // Another tab may have recovered while we waited for the lock. Recovering
  // again would overwrite its fresh cookie, so check the session first.
  try {
    const me = await fetch('/api/auth/me', { cache: 'no-store' });
    if (me.ok) {
      const data = (await me.json()) as Pick<AuthMeResponse, 'auth'>;
      if (data.auth.isValidToken) {
        return { kind: 'recovered', expiresAtMs: data.auth.expiresAtMs };
      }
    }
  } catch {
    // Could not read the session; try the recover route.
  }

  // Network or parse errors return undefined so the caller still sees its 401
  // instead of a TypeError.
  let response: Response;
  try {
    response = await fetch('/api/auth/recover', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ returnTo: ctx.returnTo, notice: ctx.notice }),
      cache: 'no-store',
    });
  } catch {
    return undefined;
  }
  if (!response.ok) {
    return undefined;
  }
  try {
    return (await response.json()) as AuthRecoveryResult;
  } catch {
    return undefined;
  }
}

function buildRecoveryRedirectUrl(result: {
  returnTo: string;
  notice?: string;
}): string {
  const url = new URL(result.returnTo, window.location.origin);
  url.searchParams.delete(AUTH_LOOP_MARKER_PARAM);
  if (result.notice) {
    url.searchParams.set(AUTH_NOTICE_PARAM, result.notice);
  }
  return `${url.pathname}${url.search}`;
}

async function invalidatePostRecovery(): Promise<void> {
  const queryClient = getQueryClient();
  await Promise.all(
    AUTH_RECOVERY_INVALIDATION_QUERY_KEYS.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey: [...queryKey] })
    )
  );
}

// After navigating, the promise never settles so the old 401 isn't thrown
// into a page that is going away.
function suspendForever(): Promise<never> {
  return new Promise<never>(() => {});
}
