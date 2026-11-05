'use client';
import { useCallback } from 'react';

import { type AuthLogoutNotice } from '@/utils/auth/auth.types';
import getAuthClientPolicy from '@/utils/auth/strategies/get-auth-client-policy';
import useUserInfo from '@/views/shared/hooks/use-user-info/use-user-info';

import { type AuthLifecycle } from './use-auth-lifecycle.types';

export default function useAuthLifecycle(): AuthLifecycle {
  const { data: authInfo, isLoading: isAuthLoading } = useUserInfo();

  const policy = getAuthClientPolicy(authInfo?.authStrategy);

  const logout = useCallback(
    async (options?: { notice?: AuthLogoutNotice }) => {
      await policy?.logout(options);
    },
    [policy]
  );

  const expireSession = useCallback(() => {
    const { pathname, search, hash } = window.location;
    policy?.login(`${pathname}${search}${hash}`, 'session-expired');
  }, [policy]);

  return {
    isAuthEnabled: authInfo?.authEnabled === true,
    isValidToken: authInfo?.auth?.isValidToken === true,
    isAuthLoading,
    isAdmin: authInfo?.isAdmin === true,
    userName: authInfo?.userName,
    logout,
    expireSession,
  };
}
