import { type AuthRequest } from '@/utils/auth/auth.types';

import { CADENCE_AUTH_COOKIE_NAME } from './jwt-auth.constants';

export default function getJwtTokenFromRequest(
  request: AuthRequest
): string | undefined {
  return (
    request.cookies.get(CADENCE_AUTH_COOKIE_NAME)?.value?.trim() || undefined
  );
}
