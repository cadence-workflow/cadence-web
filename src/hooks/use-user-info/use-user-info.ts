'use client';
import { useQuery } from '@tanstack/react-query';

import { type PublicAuthContext } from '@/utils/auth/auth-shared';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

export default function useUserInfo() {
  return useQuery<PublicAuthContext, RequestError>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await request('/api/auth/me', { method: 'GET' });
      return res.json();
    },
    staleTime: 30_000,
  });
}
