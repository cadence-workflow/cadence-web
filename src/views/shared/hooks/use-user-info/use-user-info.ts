'use client';
import { useQuery } from '@tanstack/react-query';

import { type PublicAuthContext } from '@/utils/auth/auth-shared.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

export default function useUserInfo() {
  return useQuery<PublicAuthContext, RequestError>({
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
