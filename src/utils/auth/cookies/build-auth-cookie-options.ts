import { type NextRequest } from 'next/server';

import { AUTH_COOKIE_OPTIONS } from '../auth.constants';
import getCookieSecureAttribute from '../helpers/get-cookie-secure-attribute';

/** Shared flags for every auth cookie. Callers only pass name, value, and maxAge. */
export default function buildAuthCookieOptions(
  request: NextRequest,
  maxAge?: number
): {
  httpOnly: boolean;
  sameSite: 'lax';
  path: string;
  secure: boolean;
  maxAge?: number;
} {
  return {
    ...AUTH_COOKIE_OPTIONS,
    secure: getCookieSecureAttribute(request),
    ...(maxAge !== undefined ? { maxAge } : {}),
  };
}
