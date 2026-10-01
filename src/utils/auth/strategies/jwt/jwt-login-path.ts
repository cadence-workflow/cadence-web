import queryString from 'query-string';

import { JWT_LOGIN_PATH } from '@/utils/auth/auth.constants';
import { type AuthLogoutNotice } from '@/utils/auth/auth.types';
import { sanitizeReturnTo } from '@/utils/auth/helpers/sanitize-return-to';

export function buildJwtLoginPath(
  returnTo?: string | null,
  notice?: AuthLogoutNotice
): string {
  return queryString.stringifyUrl({
    url: JWT_LOGIN_PATH,
    query: {
      returnTo: sanitizeReturnTo(returnTo),
      notice,
    },
  });
}

export function isJwtLoginReturnTo(returnTo: string): boolean {
  return (
    returnTo === JWT_LOGIN_PATH || returnTo.startsWith(`${JWT_LOGIN_PATH}?`)
  );
}
