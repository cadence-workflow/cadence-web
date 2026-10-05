import { AUTH_LOGOUT_NOTICE_SET } from '../auth.constants';
import { type AuthLogoutNotice } from '../auth.types';

export function isAuthLogoutNotice(
  value: string | null | undefined
): value is AuthLogoutNotice {
  return value != null && AUTH_LOGOUT_NOTICE_SET.has(value);
}
