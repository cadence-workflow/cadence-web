import 'server-only';

import {
  cookies as getRequestCookies,
  headers as getRequestHeaders,
} from 'next/headers';

import { type AuthRequest } from '../auth.types';

/**
 * Reads cookies and headers from the current Next.js request.
 * Throws outside a request, so a missing request is not treated as signed out.
 */
export default function getImplicitAuthRequest(): AuthRequest {
  return { cookies: getRequestCookies(), headers: getRequestHeaders() };
}
