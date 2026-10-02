import { type NextRequest, NextResponse } from 'next/server';

import { NO_STORE_HEADERS } from '@/utils/auth/auth.constants';
import validateAndReplayAuthCookieMutations from '@/utils/auth/cookies/validate-and-replay-auth-cookie-mutations';
import isSameOriginRequest from '@/utils/auth/helpers/is-same-origin-request';
import { JWT_AUTH_COOKIE_NAME } from '@/utils/auth/strategies/jwt/jwt-auth.constants';
import logger, { type RouteHandlerErrorPayload } from '@/utils/logger';

import {
  AUTH_TOKEN_SUCCESS_RESPONSE,
  INVALID_REQUEST_BODY_MESSAGE,
  INVALID_REQUEST_MESSAGE,
} from './auth-token.constants';
import { type AuthTokenResponse } from './auth-token.types';
import tokenRequestBodySchema from './schemas/token-request-body-schema';

const badRequest = (message: string) =>
  NextResponse.json({ message }, { status: 400, headers: NO_STORE_HEADERS });

export async function setAuthToken(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { message: 'Cross-origin request rejected' },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return badRequest(INVALID_REQUEST_BODY_MESSAGE);
  }

  const { data, error } = tokenRequestBodySchema.safeParse(requestBody);
  if (error) {
    return badRequest(error.errors[0]?.message ?? INVALID_REQUEST_MESSAGE);
  }

  const response = NextResponse.json(
    AUTH_TOKEN_SUCCESS_RESPONSE satisfies AuthTokenResponse,
    { headers: NO_STORE_HEADERS }
  );
  let replay: Awaited<ReturnType<typeof validateAndReplayAuthCookieMutations>>;
  try {
    replay = await validateAndReplayAuthCookieMutations(request, response, [
      { set: { name: JWT_AUTH_COOKIE_NAME, value: data.token } },
    ]);
  } catch (e) {
    // Strategy/config resolution failing is infrastructure, not input —
    // report it as such instead of a misleading 400.
    logger.error<RouteHandlerErrorPayload>(
      { error: e },
      'Failed to write auth token cookie'
    );
    return NextResponse.json(
      { message: 'Unexpected error' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
  if (!replay.ok) {
    // Under any non-jwt strategy the jwt cookie is outside the active
    // strategy's declared set, so the write is rejected here.
    logger.warn({ reason: replay.reason }, 'Rejected auth token write');
    return badRequest(INVALID_REQUEST_MESSAGE);
  }
  return response;
}
