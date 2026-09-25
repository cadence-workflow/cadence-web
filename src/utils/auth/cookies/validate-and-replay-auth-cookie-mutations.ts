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

/** UTF-8 size of the string as it is sent. */
function wireBytes(value: string): number {
  return new TextEncoder().encode(value).length;
}

/** Size of one cookie after flags are added.
 * The value is percent-encoded. maxAge also adds an Expires date. */
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

/** Total size of a mutation list after flags are added.
 * Exported so a strategy can trim a session before this check runs. */
export function measureAuthCookieMutationsBytes(
  mutations: CookieMutation[],
  secure: boolean
): number {
  return mutations.reduce(
    (sum, mutation) => sum + measureMutationBytes(mutation, secure),
    0
  );
}

/** Checks the mutation list, then writes every cookie.
 * Rejects a name outside cookieNames, or a total over the byte budget.
 * If either check fails, nothing is written. */
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

  // Warn when auth cookies are written over plain HTTP on a non-local host.
  // The write still happens. Localhost stays quiet.
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
