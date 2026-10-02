import { type RequestOptions } from '@/utils/request/request.types';

/**
 * Auth-internal endpoints never trigger recovery: a 401 from them is the
 * outcome of an auth check, not a recoverable session failure. Callers
 * hitting non-Cadence URLs opt out via `skipAuthRecovery`.
 */
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
