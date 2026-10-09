import 'server-only';

import { type NextRequest, NextResponse } from 'next/server';

import logger from '@/utils/logger';

import { AUTH_COOKIE_MUTATIONS_MAX_BYTES } from '../auth.constants';
import { type CookieMutation } from '../auth.types';
import isLoopbackHost from '../helpers/is-loopback-host';
import getActiveAuthServerEntry from '../strategies/get-active-auth-server-entry';
import getDeclaredAuthCookieNames from '../strategies/get-declared-auth-cookie-names';

import buildAuthCookieOptions from './build-auth-cookie-options';
import {
  type AuthCookieParams,
  type ValidateAndReplayResult,
} from './validate-and-replay-auth-cookie-mutations.types';

function isCookieNameDeclared(
  name: string,
  cookieNames: { exact: string[]; prefixes: string[] }
): boolean {
  return (
    cookieNames.exact.includes(name) ||
    cookieNames.prefixes.some((prefix) => name.startsWith(prefix))
  );
}

/** One entry per cookie to write, with the exact options the write uses.
 * Shared by measurement and the write so the two cannot drift. */
function buildAuthCookieParams(
  request: NextRequest,
  mutations: CookieMutation[]
): AuthCookieParams[] {
  const sharedOptions = buildAuthCookieOptions(request);
  return mutations.map((mutation) => {
    if ('set' in mutation) {
      return {
        name: mutation.set.name,
        value: mutation.set.value,
        options: buildAuthCookieOptions(request, mutation.set.maxAge),
      };
    }
    return {
      name: mutation.clear.name,
      value: '',
      options: { ...sharedOptions, expires: new Date(0), maxAge: 0 },
    };
  });
}

/** Total Set-Cookie bytes for the cookies, measured on a throwaway
 * response so the count matches what the real write serializes.
 * @param cookies - cookies with the exact options used for the write
 * @returns totalBytes, and exceedsBudget when over the byte budget
 */
export function measureAuthCookieMutationsBytes(cookies: AuthCookieParams[]): {
  totalBytes: number;
  exceedsBudget: boolean;
} {
  const measured = new NextResponse();
  for (const { name, value, options } of cookies) {
    measured.cookies.set(name, value, options);
  }
  const totalBytes = measured.headers
    .getSetCookie()
    .reduce((sum, header) => sum + new TextEncoder().encode(header).length, 0);
  return {
    totalBytes,
    exceedsBudget: totalBytes > AUTH_COOKIE_MUTATIONS_MAX_BYTES,
  };
}

/** Checks the mutation list, then writes every cookie.
 * Sets must use a name declared by the active strategy. Clears may use any
 * name declared by any strategy, so a leftover cookie can still be expired
 * after a strategy change. Writes nothing if a name is rejected or the
 * total size is over budget.
 * @param request - incoming request, source of the Secure attribute decision
 * @param response - response the cookies are written to
 * @param mutations - set/clear operations to validate, then replay
 * @returns ok when written; the rejection reason otherwise
 */
export default async function validateAndReplayAuthCookieMutations(
  request: NextRequest,
  response: NextResponse,
  mutations: CookieMutation[]
): Promise<ValidateAndReplayResult> {
  if (mutations.length === 0) {
    return { ok: true };
  }

  const { cookieNames: activeCookieNames } = await getActiveAuthServerEntry();
  const clearableCookieNames = getDeclaredAuthCookieNames();

  for (const mutation of mutations) {
    if ('set' in mutation) {
      if (!isCookieNameDeclared(mutation.set.name, activeCookieNames)) {
        logger.warn(
          { name: mutation.set.name },
          "Auth cookie set rejected: name outside the active strategy's declared set"
        );
        return {
          ok: false,
          reason: 'unknown-cookie-name',
          name: mutation.set.name,
        };
      }
      continue;
    }
    if (!isCookieNameDeclared(mutation.clear.name, clearableCookieNames)) {
      logger.warn(
        { name: mutation.clear.name },
        'Auth cookie clear rejected: name outside the declared auth-cookie set'
      );
      return {
        ok: false,
        reason: 'unknown-cookie-name',
        name: mutation.clear.name,
      };
    }
  }

  const { secure } = buildAuthCookieOptions(request);
  const cookies = buildAuthCookieParams(request, mutations);
  const { totalBytes, exceedsBudget } =
    measureAuthCookieMutationsBytes(cookies);
  if (exceedsBudget) {
    return { ok: false, reason: 'over-budget', totalBytes };
  }

  // Warn when auth cookies are written over plain HTTP on a non-local host.
  // The write still happens.
  if (!secure && !isLoopbackHost(request.nextUrl.hostname)) {
    logger.warn(
      { host: request.nextUrl.host, mutationCount: mutations.length },
      'Writing auth cookies without the Secure attribute on a non-loopback host'
    );
  }

  for (const { name, value, options } of cookies) {
    response.cookies.set(name, value, options);
  }

  return { ok: true };
}
