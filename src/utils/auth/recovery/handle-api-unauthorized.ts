import { getQueryClient } from '@/utils/query-client/query-client';

import { AUTH_LOOP_MARKER_PARAM, AUTH_NOTICE_PARAM } from '../auth.constants';
import { type AuthRecoveryResult } from '../auth.types';

import {
  AUTH_RECOVERY_INVALIDATION_QUERY_KEYS,
  AUTH_RECOVERY_LOCK_NAME,
} from './auth-recovery.constants';
import { type HandleApiUnauthorizedContext } from './handle-api-unauthorized.types';

/**
 * The single client recovery entry point: the request() 401 pipeline enters
 * here — no other code path calls /api/auth/recover.
 *
 * Flow: in-tab dedup → Web Locks serialization → re-check validity (a
 * sibling tab may already have recovered; the browser has the winner's
 * cookie) → POST /api/auth/recover → on 'recovered' invalidate the
 * post-recovery query set; on 'redirect' navigate AFTER the lock callback
 * returned, then suspend — a never-settling promise inside the lock callback
 * would hold the cross-tab lock forever on a failed navigation.
 */
let recoveryInFlight: Promise<AuthRecoveryResult | undefined> | null = null;

export async function handleApiUnauthorized(
  ctx: HandleApiUnauthorizedContext
): Promise<AuthRecoveryResult | undefined> {
  // In-tab dedup: concurrent 401s in one tab share one recovery attempt.
  // The window covers only the lock + recover exchange. Post-recovery
  // invalidation runs after it closes: invalidateQueries awaits active
  // refetches, a refetch's 401 re-enters this function, and joining the
  // in-flight promise from inside its own continuation would deadlock.
  const isOwner = recoveryInFlight === null;
  // ??= keeps the awaited local non-nullable; the module-level variable is
  // nullable because the finally callback clears it.
  const inFlight = (recoveryInFlight ??= runSerializedRecovery(ctx).finally(
    () => {
      recoveryInFlight = null;
    }
  ));
  const result = await inFlight;

  if (result?.kind === 'redirect') {
    // Only the caller that ran the recovery navigates; joiners suspend
    // alongside it (navigation is tab-global).
    if (isOwner) {
      window.location.assign(buildRecoveryRedirectUrl(result));
    }
    return suspendForever();
  }

  // Side effects run once per recovery, not once per deduped caller:
  // invalidateQueries cancels in-flight refetches by default, so N callers
  // invalidating in a row would cascade cancelled auth-me refetches.
  if (result?.kind === 'recovered' && isOwner) {
    await invalidatePostRecovery();
  }
  return result;
}

async function runSerializedRecovery(
  ctx: HandleApiUnauthorizedContext
): Promise<AuthRecoveryResult | undefined> {
  // Lock-less browsers (and jsdom) fall back to a direct call; the
  // server-side freshness check in the policy's recoverSession is the
  // mitigation for the residual double-grant window.
  if (typeof navigator.locks === 'undefined') {
    return recoverOnce(ctx);
  }
  try {
    return await navigator.locks.request(AUTH_RECOVERY_LOCK_NAME, () =>
      recoverOnce(ctx)
    );
  } catch {
    // Lock-manager failures decline recovery; the caller's 401 stands.
    return undefined;
  }
}

async function recoverOnce(
  ctx: HandleApiUnauthorizedContext
): Promise<AuthRecoveryResult | undefined> {
  // Re-check inside the lock: a sibling tab may already have recovered, and
  // the browser already has the winner's new cookie — running a grant (or, for
  // jwt, clearing the fresh cookie) would clobber it. The re-check is an
  // optimization; a failed read falls through to the authoritative recover
  // route (whose server-side freshness check is the equivalent).
  try {
    const me = await fetch('/api/auth/me', { cache: 'no-store' });
    if (me.ok) {
      const data = (await me.json()) as {
        auth?: { isValidToken?: boolean; expiresAtMs?: number };
      };
      if (data.auth?.isValidToken === true) {
        return { kind: 'recovered', expiresAtMs: data.auth.expiresAtMs };
      }
    }
  } catch {
    // fall through to the recover route
  }

  // Transport and payload failures decline recovery (undefined) rather than
  // replacing the caller's 401 with a raw TypeError/SyntaxError.
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

/**
 * The redirect outcome carries {returnTo, notice}; the notice rides to the
 * final landing URL as `authNotice` (the channel the nav renders and
 * strips). The layout gate re-dispatches to the strategy's login surface from
 * there. Any stale loop marker on the previous URL is dropped.
 */
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

/**
 * Once navigation has been issued the caller suspends (never settles) so the
 * stale 401 is not also thrown into a page that is leaving. Tradeoff, named:
 * a failed navigation leaves a pending query — the recoverable case; a
 * permanently held lock would deadlock recovery in every tab.
 */
function suspendForever(): Promise<never> {
  return new Promise<never>(() => {});
}
