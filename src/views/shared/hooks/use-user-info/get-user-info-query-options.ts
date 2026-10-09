import { queryOptions } from '@tanstack/react-query';

import { type AuthMeResponse } from '@/route-handlers/get-auth-me/get-auth-me.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import {
  EXPIRED_TOKEN_RECHECK_INTERVAL_MS,
  MAX_TIMER_DELAY_MS,
} from './use-user-info.constants';

export default function getUserInfoQueryOptions() {
  return queryOptions<AuthMeResponse, RequestError>({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const res = await request('/api/auth/me', { method: 'GET' });
      return res.json();
    },
    // The global staleTime is Infinity, but auth must recheck when a tab
    // becomes visible so a login/logout in another tab is picked up.
    refetchOnWindowFocus: 'always',
    // Recheck at token expiry; the nav redirects once the server says invalid.
    // A browser clock ahead of the server keeps rechecking instead of looping.
    refetchInterval: (query) => {
      const auth = query.state.data?.auth;
      if (!auth?.isValidToken || auth.expiresAtMs === undefined) return false;
      const untilExpiryMs = auth.expiresAtMs - Date.now();
      // Capped: a longer delay overflows and the timer fires immediately.
      return untilExpiryMs > 0
        ? Math.min(untilExpiryMs, MAX_TIMER_DELAY_MS)
        : EXPIRED_TOKEN_RECHECK_INTERVAL_MS;
    },
  });
}
