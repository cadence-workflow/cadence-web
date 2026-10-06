'use client';
import { useSuspenseQuery } from '@tanstack/react-query';

import getUserInfoQueryOptions from './get-user-info-query-options';

export default function useSuspenseUserInfo() {
  return useSuspenseQuery(getUserInfoQueryOptions());
}
