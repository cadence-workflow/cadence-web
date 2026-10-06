import { queryOptions } from '@tanstack/react-query';

import { type AuthMeResponse } from '@/route-handlers/auth-me/auth-me.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

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
  });
}
