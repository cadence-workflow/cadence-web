import { NextResponse, type NextRequest } from 'next/server';

import { resolveAuthContext } from '@/utils/auth/auth-context';
import { type AuthMeResponse } from '@/utils/auth/auth.types';
import getConfigValue from '@/utils/config/get-config-value';

/**
 * GET /api/auth/me — the one identity+session endpoint. `auth` is an
 * EXPLICIT projection of AuthContext.auth — a field added to the context can
 * never leak to the client by accident; identity fields are top-level and
 * present only with a valid session; groups never leave the server.
 */
export async function GET(request: NextRequest) {
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
