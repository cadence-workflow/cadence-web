'use client';
import { useQuery } from '@tanstack/react-query';

import getUserInfoQueryOptions from './get-user-info-query-options';

export default function useUserInfo() {
  return useQuery(getUserInfoQueryOptions());
}
