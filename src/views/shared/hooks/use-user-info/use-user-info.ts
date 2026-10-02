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
  });
}

export default function useUserInfo() {
  return useQuery(userInfoQueryOptions());
}
