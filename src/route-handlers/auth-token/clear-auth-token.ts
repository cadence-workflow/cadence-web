import { type NextRequest, NextResponse } from 'next/server';

import validateAndReplayAuthCookieMutations from '@/utils/auth/cookies/validate-and-replay-auth-cookie-mutations';
import { JWT_AUTH_COOKIE_NAME } from '@/utils/auth/strategies/jwt/jwt-auth.constants';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  AUTH_TOKEN_SUCCESS_RESPONSE,
  INVALID_REQUEST_MESSAGE,
  NO_STORE_HEADERS,
} from './auth-token.constants';
import { type AuthTokenResponse } from './auth-token.types';

export async function clearAuthToken(request: NextRequest) {
  const response = NextResponse.json(
    AUTH_TOKEN_SUCCESS_RESPONSE satisfies AuthTokenResponse,
    { headers: NO_STORE_HEADERS }
  );
  let replay: Awaited<ReturnType<typeof validateAndReplayAuthCookieMutations>>;
  try {
    replay = await validateAndReplayAuthCookieMutations(request, response, [
      { clear: { name: JWT_AUTH_COOKIE_NAME } },
    ]);
  } catch (e) {
    // Strategy/config resolution failing is infrastructure, not input —
    // same reporting as the POST writer.
    logger.error<RouteHandlerErrorPayload>(
      { error: e },
      'Failed to clear auth token cookie'
    );
    return NextResponse.json(
      { message: 'Unexpected error' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
  if (!replay.ok) {
    logger.warn({ reason: replay.reason }, 'Rejected auth token clear');
    return NextResponse.json(
      { message: INVALID_REQUEST_MESSAGE },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }
  return response;
}
