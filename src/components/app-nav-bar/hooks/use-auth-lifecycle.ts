'use client';
import { useCallback } from 'react';

import { type AuthLogoutNotice } from '@/utils/auth/auth.types';
import { handleApiUnauthorized } from '@/utils/auth/recovery/handle-api-unauthorized';
import getAuthClientPolicy from '@/utils/auth/strategies/get-auth-client-policy';
import useUserInfo from '@/views/shared/hooks/use-user-info/use-user-info';

import { type AuthLifecycle } from './use-auth-lifecycle.types';

/**
 * Policy-driven auth lifecycle for the nav bar: every strategy-conditional
 * behavior reads fields off the active client policy — never strategy-string
 * comparisons.
 */
export default function useAuthLifecycle(): AuthLifecycle {
  const { data: authInfo, isLoading: isAuthLoading } = useUserInfo();

  const policy = getAuthClientPolicy(authInfo?.authStrategy);

  const logout = useCallback(
    (options?: { notice?: AuthLogoutNotice }) =>
      policy?.logout(options) ?? Promise.resolve(),
    [policy]
  );

  // The effective capability is the conjunction: a refresh-less session on a
  // recovery-capable strategy must get the expiry warning, not a doomed
  // silent recovery — supportsSessionRecovery is never read in isolation.
  const canRecover =
    policy?.supportsSessionRecovery === true &&
    authInfo?.auth?.canRefresh === true;

  // Manual recovery enters the single lock-acquisition entry point, same as
  // the 401 pipeline and the proactive timer.
  const recoverSession = useCallback(
    (returnTo?: string) =>
      handleApiUnauthorized({
        returnTo:
          returnTo ?? `${window.location.pathname}${window.location.search}`,
        notice: 'session-expired',
      }),
    []
  );

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
    canRecover,
    logout,
    recoverSession,
  };
}
