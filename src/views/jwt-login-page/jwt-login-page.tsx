'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Textarea } from 'baseui/textarea';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdVpnKey } from 'react-icons/md';

import cadenceLogo from '@/assets/cadence-logo-black.svg';
import { isAuthLogoutNotice } from '@/utils/auth/helpers/is-auth-logout-notice';
import { sanitizeReturnTo } from '@/utils/auth/helpers/sanitize-return-to';
import request from '@/utils/request';
import useUserInfo from '@/views/shared/hooks/use-user-info/use-user-info';

import getNoticeMessage from './helpers/get-notice-message';
import { overrides, styled } from './jwt-login-page.styles';

/**
 * The jwt strategy's login page: a token paste form. The not-jwt redirect
 * lives in the server page (`app/login/page.tsx`); this component renders
 * only under the jwt strategy.
 */
export default function JwtLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: authInfo, isLoading: isAuthLoading, refetch } = useUserInfo();
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnTo = useMemo(
    () => sanitizeReturnTo(searchParams.get('returnTo')),
    [searchParams]
  );
  const notice = useMemo(() => {
    const value = searchParams.get('notice');
    return isAuthLogoutNotice(value) ? value : undefined;
  }, [searchParams]);

  const isValidToken = authInfo?.auth.isValidToken === true;

  // A session that is already valid never sees the form.
  useEffect(() => {
    if (isAuthLoading || !authInfo) return;
    if (isValidToken) {
      router.replace(returnTo);
    }
  }, [isAuthLoading, authInfo, isValidToken, returnTo, router]);

  const handleSubmit = useCallback(async () => {
    if (!token.trim()) {
      setError('Please paste a JWT token first');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await request('/api/auth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });
      const { data } = await refetch({ throwOnError: true });
      if (data?.auth?.isValidToken !== true) {
        setError('Token is expired or invalid');
        return;
      }
      await queryClient.invalidateQueries();
      router.replace(returnTo);
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Failed to save authentication token'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [queryClient, refetch, returnTo, router, token]);

  return (
    <styled.Page>
      {notice ? (
        <styled.Notice>
          <MdVpnKey aria-hidden size={20} />
          {getNoticeMessage(notice)}
        </styled.Notice>
      ) : null}

      <styled.Card>
        <Image
          src={cadenceLogo}
          width={48}
          height={48}
          alt="Cadence"
          priority
        />
        <styled.Heading>
          <styled.Title>Cadence · JWT authentication</styled.Title>
          <styled.Description>
            Paste a Cadence-compatible JWT
          </styled.Description>
        </styled.Heading>
        <styled.TokenField>
          <FormControl error={error || null}>
            <Textarea
              aria-label="Cadence JWT"
              value={token}
              onChange={(event) =>
                setToken((event?.target as HTMLTextAreaElement)?.value || '')
              }
              clearOnEscape
              disabled={isSubmitting || isAuthLoading}
              rows={4}
            />
          </FormControl>
        </styled.TokenField>
        <Button
          overrides={overrides.saveButton}
          onClick={() => void handleSubmit()}
          isLoading={isSubmitting}
          disabled={isAuthLoading}
          data-testid="jwt-login-submit"
        >
          Save token
        </Button>
      </styled.Card>
    </styled.Page>
  );
}
