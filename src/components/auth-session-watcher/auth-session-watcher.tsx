'use client';
import { useEffect, useRef } from 'react';

import useAuthLifecycle from '@/hooks/use-auth-lifecycle/use-auth-lifecycle';

/**
 * Client twin of the Home layout server gate: when /api/auth/me reports a
 * valid→invalid flip (expiry, other-tab logout), send the user to the strategy
 * login surface with session-expired. Leaves the cookie alone.
 */
export default function AuthSessionWatcher() {
  const { isAuthEnabled, isValidToken, isAuthLoading, expireSession } =
    useAuthLifecycle();
  const prevIsValidTokenRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isAuthEnabled || isAuthLoading) return;
    const prevIsValidToken = prevIsValidTokenRef.current;
    prevIsValidTokenRef.current = isValidToken;

    if (prevIsValidToken === true && !isValidToken) {
      expireSession();
    }
  }, [isValidToken, isAuthLoading, isAuthEnabled, expireSession]);

  return null;
}
