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
export default async function getImplicitAuthRequest(): Promise<AuthRequest> {
  return {
    cookies: await getRequestCookies(),
    headers: await getRequestHeaders(),
  };
}
