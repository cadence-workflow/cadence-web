import { type NextRequest, NextResponse } from 'next/server';

import { CADENCE_AUTH_COOKIE_NAME } from '@/utils/auth/auth-context';

import {
  AUTH_TOKEN_COOKIE_OPTIONS,
  AUTH_TOKEN_SUCCESS_RESPONSE,
} from './auth-token.constants';
import { type AuthTokenResponse } from './auth-token.types';
import getCookieSecureAttribute from './helpers/get-cookie-secure-attribute';

export async function clearAuthToken(request: NextRequest) {
  const response = NextResponse.json(
    AUTH_TOKEN_SUCCESS_RESPONSE satisfies AuthTokenResponse
  );
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set(CADENCE_AUTH_COOKIE_NAME, '', {
    ...AUTH_TOKEN_COOKIE_OPTIONS,
    secure: getCookieSecureAttribute(request),
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}
