import { JWT_LOGIN_PATH } from '@/utils/auth/auth.constants';
import { type AuthLogoutNotice } from '@/utils/auth/auth.types';
import { sanitizeReturnTo } from '@/utils/auth/helpers/sanitize-return-to';

export default function buildJwtLoginPath(
  returnTo?: string | null,
  notice?: AuthLogoutNotice
): string {
  const params = new URLSearchParams({
    returnTo: sanitizeReturnTo(returnTo),
  });
  if (notice) {
    params.set('notice', notice);
  }
  return `${JWT_LOGIN_PATH}?${params.toString()}`;
}
