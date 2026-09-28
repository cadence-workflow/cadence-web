'use client';
import { useCallback } from 'react';

import { type AuthLogoutNotice } from '@/utils/auth/auth.types';
import jwtClientPolicy from '@/utils/auth/strategies/jwt/jwt-client-policy';
import useUserInfo from '@/views/shared/hooks/use-user-info/use-user-info';

import { type AuthLifecycle } from './use-auth-lifecycle.types';

export default function useAuthLifecycle(): AuthLifecycle {
  const { data: authInfo, isLoading: isAuthLoading } = useUserInfo();

  // jwt is the only auth-enabled strategy, so the nav dispatches to the jwt
  // client policy directly; its items render only when auth is enabled.
  const login = useCallback((returnTo?: string) => {
    jwtClientPolicy.login(returnTo);
  }, []);

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
    labels: jwtClientPolicy.labels,
    login,
    logout,
  };
}
