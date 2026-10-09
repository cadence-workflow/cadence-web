import 'server-only';

import {
  cookies as getRequestCookies,
  headers as getRequestHeaders,
} from 'next/headers';

import { DEFAULT_AUTH_RETURN_TO } from './auth.constants';
import hasAuthSessionCookie from './helpers/has-auth-session-cookie';
import getActiveAuthServerEntry from './strategies/get-active-auth-server-entry';

export default async function getLoginRedirect(): Promise<string | null> {
  const entry = await getActiveAuthServerEntry();
  const authContext = await entry.policy.resolveAuthContext();
  const returnTo =
    getRequestHeaders().get('x-cadence-return-to') ?? DEFAULT_AUTH_RETURN_TO;
  const notice =
    !authContext.auth.isValidToken &&
    hasAuthSessionCookie(getRequestCookies(), entry.cookieNames)
      ? ('session-expired' as const)
      : undefined;

  return entry.policy.getLoginRedirectIfNeeded(authContext, returnTo, notice);
}
