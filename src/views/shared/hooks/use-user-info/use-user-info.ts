'use client';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { type AuthMeResponse } from '@/utils/auth/auth.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

/**
 * The single producer of the ['auth-me'] query. Suspense consumers use the
 * same options with useSuspenseQuery.
 */
export function userInfoQueryOptions() {
  return queryOptions<AuthMeResponse, RequestError>({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const res = await request('/api/auth/me', { method: 'GET' });
      return res.json();
    },
    // The global staleTime is Infinity; auth must still recheck when a tab
    // becomes visible so a login/logout in another tab is picked up.
    refetchOnWindowFocus: 'always',
  });
}

export default function useUserInfo() {
  return useQuery(userInfoQueryOptions());
}
