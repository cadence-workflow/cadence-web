import 'server-only';

import { type NextRequest, type NextResponse } from 'next/server';

import logger from '@/utils/logger';

import { AUTH_COOKIE_MUTATIONS_MAX_BYTES } from '../auth.constants';
import {
  type AuthServerRegistryEntry,
  type CookieMutation,
} from '../auth.types';
import isLoopbackHost from '../helpers/is-loopback-host';

import buildAuthCookieOptions from './build-auth-cookie-options';
import { type ValidateAndReplayResult } from './validate-and-replay-auth-cookie-mutations.types';

const EXPIRES_EPOCH_ATTRIBUTE = '; Expires=Thu, 01 Jan 1970 00:00:00 GMT';

/** Byte length on the wire (UTF-8), not JS UTF-16 code units. */
function wireBytes(value: string): number {
  return new TextEncoder().encode(value).length;
}

/** Serialized size of one mutation as the replay will emit it — the strategy
 * cannot know this total (the options builder adds the attributes). Mirrors
 * `@edge-runtime/cookies` serialization: values are `encodeURIComponent`'d
 * (escaped chars take up to 3 bytes each) and a truthy `maxAge` also emits an
 * auto-derived `Expires` attribute (any RFC 1123 GMT date has the epoch
 * stand-in's exact length). */
function measureMutationBytes(
  mutation: CookieMutation,
  secure: boolean
): number {
  const secureAttribute = secure ? '; Secure' : '';
  if ('set' in mutation) {
    const { name, value, maxAge } = mutation.set;
    const expiresAttribute = maxAge ? EXPIRES_EPOCH_ATTRIBUTE : '';
    const maxAgeAttribute = maxAge !== undefined ? `; Max-Age=${maxAge}` : '';
    return wireBytes(
      `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax${secureAttribute}${expiresAttribute}${maxAgeAttribute}`
    );
  }
  return wireBytes(
    `${mutation.clear.name}=; Path=/; HttpOnly; SameSite=Lax${secureAttribute}${EXPIRES_EPOCH_ATTRIBUTE}; Max-Age=0`
  );
}

/**
 * Total serialized size of a mutation array as the replay will emit it.
 * Exported for the OIDC strategy's session-trim decision (the strategy trims
 * before the route's authoritative validation) — the one measurement
 * implementation shared by both so the two never drift.
 */
export function measureAuthCookieMutationsBytes(
  mutations: CookieMutation[],
  secure: boolean
): number {
  return mutations.reduce(
    (sum, mutation) => sum + measureMutationBytes(mutation, secure),
    0
  );
}

/**
 * The one auth-cookie-writing function: validates the whole
 * mutation array against the strategy registry-entry cookie-name set (exact
 * names + declared prefixes — never a module-wide union, so a buggy fork
 * strategy cannot name another strategy's cookie) and the total-byte
 * budget, THEN replays in order. Validate-then-replay: on any failure nothing
 * is applied and the caller substitutes its own outcome (recover route:
 * cleanupMutations; OIDC callback: loud login failure).
 *
 * Staging note: `cookieNames` is a parameter until the strategy registry
 * lands; the end state resolves the ACTIVE entry internally via
 * `getActiveAuthServerEntry()` — the token-route migration makes that swap
 * when its callers exist.
 */
export default async function validateAndReplayAuthCookieMutations(
  request: NextRequest,
  response: NextResponse,
  mutations: CookieMutation[],
  cookieNames: AuthServerRegistryEntry['cookieNames']
): Promise<ValidateAndReplayResult> {
  for (const mutation of mutations) {
    const name = 'set' in mutation ? mutation.set.name : mutation.clear.name;
    const isKnown =
      cookieNames.exact.includes(name) ||
      cookieNames.prefixes.some((prefix) => name.startsWith(prefix));
    if (!isKnown) {
      logger.warn(
        { name },
        "Auth cookie mutation rejected: name outside the active strategy's declared set"
      );
      return { ok: false, reason: 'unknown-cookie-name', name };
    }
  }

  const options = buildAuthCookieOptions(request);
  const totalBytes = measureAuthCookieMutationsBytes(mutations, options.secure);
  if (totalBytes > AUTH_COOKIE_MUTATIONS_MAX_BYTES) {
    return { ok: false, reason: 'over-budget', totalBytes };
  }

  // A non-Secure session-cookie write to a non-loopback host means the
  // deployment is serving plain HTTP beyond a dev box — loud, never silent.
  if (!options.secure && !isLoopbackHost(request.nextUrl.hostname)) {
    logger.warn(
      { host: request.nextUrl.host, mutationCount: mutations.length },
      'Writing auth cookies without the Secure attribute on a non-loopback host'
    );
  }

  for (const mutation of mutations) {
    if ('set' in mutation) {
      response.cookies.set(
        mutation.set.name,
        mutation.set.value,
        buildAuthCookieOptions(request, mutation.set.maxAge)
      );
    } else {
      response.cookies.set(mutation.clear.name, '', {
        ...options,
        expires: new Date(0),
        maxAge: 0,
      });
    }
  }

  return { ok: true };
}
