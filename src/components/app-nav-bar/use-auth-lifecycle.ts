'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DURATION, useSnackbar } from 'baseui/snackbar';
import { usePathname, useRouter } from 'next/navigation';

import useUserInfo from '@/hooks/use-user-info/use-user-info';
import request from '@/utils/request';

import { type AuthLifecycle } from './use-auth-lifecycle.types';

const LOGIN_ITEM = 'login';
const LOGOUT_ITEM = 'logout';
const ERROR_SNACKBAR_OVERRIDES = {
  Root: {
    style: {
      backgroundColor: '#c62828',
    },
  },
};

export default function useAuthLifecycle(): AuthLifecycle {
  const router = useRouter();
  const pathname = usePathname();
  const { enqueue } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: authInfo, isLoading: isAuthLoading, refetch } = useUserInfo();
  const isAuthEnabled = authInfo?.authEnabled === true;
  const isAuthenticated = authInfo?.isAuthenticated === true;
  const isAdmin = authInfo?.isAdmin === true;
  const expiresAtMs =
    typeof authInfo?.expiresAtMs === 'number'
      ? authInfo.expiresAtMs
      : undefined;

  const latestExpiresAtRef = useRef<number | undefined>(expiresAtMs);
  latestExpiresAtRef.current = expiresAtMs;
  const expiryTimeoutIdRef = useRef<number | null>(null);
  const logoutInFlightRef = useRef(false);
  const prevIsAuthenticatedRef = useRef<boolean | null>(null);
  const logoutReasonRef = useRef<'manual' | 'expired' | null>(null);

  const showErrorSnackbar = useCallback(
    (
      message: string,
      duration = DURATION.medium,
      dismissActionLabel?: string
    ) => {
      enqueue(
        {
          message,
          ...(dismissActionLabel ? { actionMessage: dismissActionLabel } : {}),
          overrides: ERROR_SNACKBAR_OVERRIDES,
        },
        duration
      );
    },
    [enqueue]
  );

  const userItems = useMemo(() => {
    if (!isAuthEnabled) return undefined;
    if (!isAuthenticated) {
      return [{ label: 'Login with JWT', info: LOGIN_ITEM }];
    }
    return [
      { label: 'Switch token', info: LOGIN_ITEM },
      { label: 'Logout', info: LOGOUT_ITEM },
    ];
  }, [isAuthenticated, isAuthEnabled]);

  const username = useMemo(() => {
    if (!isAuthEnabled) {
      return undefined;
    }
    if (isAuthLoading || !authInfo) {
      return 'Checking access...';
    }
    return isAuthenticated
      ? authInfo.userName || 'Authenticated user (unknown username)'
      : 'Authenticate';
  }, [authInfo, isAuthLoading, isAuthenticated, isAuthEnabled]);

  const usernameSubtitle =
    isAuthEnabled && isAuthenticated
      ? isAdmin
        ? 'Admin'
        : undefined
      : isAuthEnabled
        ? 'Provide a Cadence JWT'
        : undefined;

  const doLogout = useCallback(
    async (reason: 'manual' | 'expired') => {
      if (logoutInFlightRef.current) return;
      logoutInFlightRef.current = true;
      logoutReasonRef.current = reason;
      setIsModalOpen(false);
      try {
        await request('/api/auth/token', { method: 'DELETE' });
      } catch (e) {
        logoutReasonRef.current = null;
        const message = e instanceof Error ? e.message : 'Failed to sign out';
        showErrorSnackbar(message);
      } finally {
        await refetch();
        router.refresh();
        router.replace('/domains');
        logoutInFlightRef.current = false;
      }
    },
    [refetch, router, showErrorSnackbar]
  );

  const saveToken = useCallback(
    async (token: string) => {
      try {
        await request('/api/auth/token', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const { data } = await refetch();
        if (!data?.isAuthenticated) {
          showErrorSnackbar('Token is expired or invalid');
          return;
        }
        enqueue({ message: 'Token saved' }, DURATION.short);
        setIsModalOpen(false);
        router.refresh();
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : 'Failed to save authentication token';
        showErrorSnackbar(message);
        throw e;
      }
    },
    [enqueue, refetch, router, showErrorSnackbar]
  );

  // Show snackbar and redirect when auth state transitions to unauthenticated
  useEffect(() => {
    if (!isAuthEnabled || isAuthLoading || !authInfo) return;
    const prevIsAuthenticated = prevIsAuthenticatedRef.current;
    prevIsAuthenticatedRef.current = isAuthenticated;

    if (prevIsAuthenticated === true && !isAuthenticated) {
      const reason = logoutReasonRef.current;
      logoutReasonRef.current = null;
      if (reason === 'manual') {
        enqueue({ message: 'Signed out' }, DURATION.medium);
      } else {
        showErrorSnackbar(
          'Session expired. Please sign in again.',
          DURATION.infinite,
          'Dismiss'
        );
      }
      if (pathname === '/domains') {
        router.refresh();
      } else {
        router.replace('/domains');
      }
    }
  }, [
    authInfo,
    enqueue,
    isAuthenticated,
    isAuthLoading,
    isAuthEnabled,
    pathname,
    router,
    showErrorSnackbar,
  ]);

  // Schedule automatic logout when token expires
  useEffect(() => {
    const clearExpiryTimeout = () => {
      if (expiryTimeoutIdRef.current === null) return;
      window.clearTimeout(expiryTimeoutIdRef.current);
      expiryTimeoutIdRef.current = null;
    };

    clearExpiryTimeout();

    if (
      !isAuthEnabled ||
      !isAuthenticated ||
      expiresAtMs === undefined ||
      logoutInFlightRef.current
    ) {
      return clearExpiryTimeout;
    }

    const timeoutMs = expiresAtMs - Date.now();
    const logoutIfCurrent = () => {
      if (logoutInFlightRef.current) return;
      if (latestExpiresAtRef.current !== expiresAtMs) return;
      void doLogout('expired');
    };

    expiryTimeoutIdRef.current = window.setTimeout(
      logoutIfCurrent,
      Math.max(0, timeoutMs)
    );

    return clearExpiryTimeout;
  }, [expiresAtMs, isAuthenticated, isAuthEnabled, doLogout]);

  return {
    isAuthEnabled,
    isAuthenticated,
    username,
    usernameSubtitle,
    userItems,
    isModalOpen,
    openModal: useCallback(() => setIsModalOpen(true), []),
    closeModal: useCallback(() => setIsModalOpen(false), []),
    saveToken,
    logout: useCallback(() => doLogout('manual'), [doLogout]),
  };
}
