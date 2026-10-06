import { type RequestOptions } from '@/utils/request/request.types';

// A 401 from the auth endpoints is an answer, not a failure to recover from.
const AUTH_API_PREFIX = '/api/auth/';

export function shouldAttemptAuthRecovery(
  url: string,
  options?: Pick<RequestOptions, 'skipAuthRecovery' | '_authRetried'>
): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  if (options?.skipAuthRecovery || options?._authRetried) {
    return false;
  }
  return !url.startsWith(AUTH_API_PREFIX);
}
