import { type AuthLogoutNotice } from '@/utils/auth/auth.types';

export default function getNoticeMessage(notice: AuthLogoutNotice): string {
  // No default: missing case = compile error.
  switch (notice) {
    case 'signed-out':
      return 'You have been signed out. Paste a new JWT to continue.';
    case 'session-expired':
      return 'Your session expired. Paste a new JWT to continue.';
  }
}
