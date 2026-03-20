import { type NextRequest, NextResponse } from 'next/server';

import { CADENCE_AUTH_COOKIE_NAME } from '@/utils/auth/auth-context';

import {
  AUTH_TOKEN_COOKIE_OPTIONS,
  AUTH_TOKEN_SUCCESS_RESPONSE,
  INVALID_REQUEST_BODY_MESSAGE,
  INVALID_REQUEST_MESSAGE,
  NO_STORE_HEADERS,
} from './auth-token.constants';
import { type AuthTokenResponse } from './auth-token.types';
import getCookieSecureAttribute from './helpers/get-cookie-secure-attribute';
import tokenRequestBodySchema from './schemas/token-request-body-schema';

const badRequest = (message: string) =>
  NextResponse.json({ message }, { status: 400, headers: NO_STORE_HEADERS });

export async function setAuthToken(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { data, error } = tokenRequestBodySchema.safeParse(requestBody);

    if (error) {
      return badRequest(error.errors[0]?.message ?? INVALID_REQUEST_MESSAGE);
    }

    const response = NextResponse.json(
      AUTH_TOKEN_SUCCESS_RESPONSE satisfies AuthTokenResponse
    );
    response.headers.set('Cache-Control', 'no-store');
    response.cookies.set(CADENCE_AUTH_COOKIE_NAME, data.token, {
      ...AUTH_TOKEN_COOKIE_OPTIONS,
      secure: getCookieSecureAttribute(request),
    });
    return response;
  } catch {
    return badRequest(INVALID_REQUEST_BODY_MESSAGE);
  }
}
