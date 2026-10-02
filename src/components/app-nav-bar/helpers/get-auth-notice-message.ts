import { type AuthLogoutNotice } from '@/utils/auth/auth.types';

/**
 * Nav snackbar copy for a landing-URL authNotice. The nav renders post-login
 * (the (Home) gate redirects invalid contexts server-side), so the expiry
 * notice is phrased as the completed round-trip, not an instruction.
 */
export default function getAuthNoticeMessage(notice: AuthLogoutNotice): string {
  // Exhaustive switch: a future notice value is a compile error here, so it
  // cannot silently render the expiry sentence.
  switch (notice) {
    case 'signed-out':
      return 'You have been signed out.';
    case 'session-expired':
      return 'Your session expired. You have been signed in again.';
  }
}
