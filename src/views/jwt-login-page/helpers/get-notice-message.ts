import { type AuthLogoutNotice } from '@/utils/auth/auth.types';

export default function getNoticeMessage(notice: AuthLogoutNotice): string {
  // Exhaustive switch: a future notice value is a compile error here, so it
  // cannot silently render the expiry sentence.
  switch (notice) {
    case 'signed-out':
      return 'You have been signed out. Paste a new JWT to continue.';
    case 'session-expired':
      return 'Your session expired. Paste a new JWT to continue.';
  }
}
