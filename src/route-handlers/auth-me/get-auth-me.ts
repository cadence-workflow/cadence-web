import { NextResponse, type NextRequest } from 'next/server';

import { resolveAuthContext } from '@/utils/auth/auth-context';
import getConfigValue from '@/utils/config/get-config-value';

import { type AuthMeResponse } from './auth-me.types';

/**
 * Returns who the user is and whether their session is valid.
 * Fields are picked one by one, so a new field on AuthContext is not sent to
 * the browser unless added here. User fields only appear with a valid session.
 */
export async function getAuthMe(request: NextRequest) {
  const [authContext, authStrategy] = await Promise.all([
    resolveAuthContext({ cookies: request.cookies, headers: request.headers }),
    getConfigValue('CADENCE_WEB_AUTH_STRATEGY'),
  ]);

  const body: AuthMeResponse = {
    authEnabled: authContext.authEnabled,
    authStrategy,
    auth: {
      isValidToken: authContext.auth.isValidToken,
      expiresAtMs: authContext.auth.expiresAtMs,
      canRefresh: authContext.auth.canRefresh,
    },
    isAdmin: authContext.isAdmin,
    ...(authContext.auth.isValidToken
      ? {
          userName: authContext.userName,
          id: authContext.id,
          pictureUrl: authContext.pictureUrl,
        }
      : {}),
  };

  return NextResponse.json(body, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
