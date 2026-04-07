'use client';
import { useCallback } from 'react';

import request from '@/utils/request';
import useUserInfo from '@/views/shared/hooks/use-user-info/use-user-info';

import { type AuthLifecycle } from '../use-auth-lifecycle.types';

export default function useAuthLifecycle(): AuthLifecycle {
  const { data: authInfo, isLoading: isAuthLoading, refetch } = useUserInfo();

  const isAuthEnabled = authInfo?.authEnabled === true;
  const isValidToken = authInfo?.auth?.isValidToken === true;
  const isAdmin = authInfo?.isAdmin === true;
  const userName = authInfo?.userName;
  const expiresAtMs =
    typeof authInfo?.auth?.expiresAtMs === 'number'
      ? authInfo.auth.expiresAtMs
      : undefined;

  const saveToken = useCallback(
    async (token: string) => {
      await request('/api/auth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const { data } = await refetch();
      return data?.auth?.isValidToken === true;
    },
    [refetch]
  );

  const logout = useCallback(async () => {
    try {
      await request('/api/auth/token', { method: 'DELETE' });
    } finally {
      await refetch();
    }
  }, [refetch]);

  return {
    isAuthEnabled,
    isValidToken,
    isAuthLoading,
    isAdmin,
    userName,
    expiresAtMs,
    saveToken,
    logout,
  };
}
