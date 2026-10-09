'use client';
import { useCallback } from 'react';

import { type AuthLogoutNotice } from '@/utils/auth/auth.types';
import jwtClientPolicy from '@/utils/auth/strategies/jwt/jwt-client-policy';
import useUserInfo from '@/views/shared/hooks/use-user-info/use-user-info';

import { type AuthLifecycle } from './use-auth-lifecycle.types';

export default function useAuthLifecycle(): AuthLifecycle {
  const { data: authInfo, isLoading: isAuthLoading } = useUserInfo();

  const logout = useCallback((options?: { notice?: AuthLogoutNotice }) => {
    return jwtClientPolicy.logout(options);
  }, []);

  return {
    isAuthEnabled: authInfo?.authEnabled === true,
    isValidToken: authInfo?.auth?.isValidToken === true,
    isAuthLoading,
    isAdmin: authInfo?.isAdmin === true,
    userName: authInfo?.userName,
    expiresAtMs:
      typeof authInfo?.auth?.expiresAtMs === 'number'
        ? authInfo.auth.expiresAtMs
        : undefined,
    logout,
  };
}
