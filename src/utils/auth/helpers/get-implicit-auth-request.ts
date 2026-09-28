import 'server-only';

import {
  cookies as getRequestCookies,
  headers as getRequestHeaders,
} from 'next/headers';

import { type AuthRequest } from '../auth.types';

/**
 * Builds an AuthRequest from the implicit request scope (the no-arg
 * resolveAuthContext form). next/headers throws outside a request scope —
 * the contract's fail-closed behavior.
 */
export default function getImplicitAuthRequest(): AuthRequest {
  return { cookies: getRequestCookies(), headers: getRequestHeaders() };
}
