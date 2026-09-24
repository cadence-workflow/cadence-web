import { type NextRequest } from 'next/server';

import { AUTH_COOKIE_OPTIONS } from '../auth.constants';
import getCookieSecureAttribute from '../helpers/get-cookie-secure-attribute';

/**
 * The one shared cookie-options builder: strategies supply only
 * name/value/maxAge; all attributes come from here so a strategy bug or fork
 * strategy cannot downgrade a session cookie. Clears carry `Secure` too.
 */
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
