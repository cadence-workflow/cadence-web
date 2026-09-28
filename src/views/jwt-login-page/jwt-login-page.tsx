'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Banner, HIERARCHY, KIND as BANNER_KIND } from 'baseui/banner';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Textarea } from 'baseui/textarea';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { isAuthLogoutNotice } from '@/utils/auth/helpers/is-auth-logout-notice';
import { sanitizeReturnTo } from '@/utils/auth/helpers/sanitize-return-to';
import request from '@/utils/request';
import useUserInfo from '@/views/shared/hooks/use-user-info/use-user-info';

import getNoticeMessage from './helpers/get-notice-message';
import { styled } from './jwt-login-page.styles';

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
      const { data } = await refetch();
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
      <styled.Title>Authenticate with JWT</styled.Title>
      <styled.Description>
        Paste a Cadence-compatible JWT issued by your identity provider.
      </styled.Description>

      {notice ? (
        <Banner
          hierarchy={HIERARCHY.low}
          kind={
            notice === 'session-expired'
              ? BANNER_KIND.negative
              : BANNER_KIND.info
          }
        >
          {getNoticeMessage(notice)}
        </Banner>
      ) : null}

      <FormControl label="Cadence JWT" error={error || null}>
        <Textarea
          value={token}
          onChange={(event) =>
            setToken((event?.target as HTMLTextAreaElement)?.value || '')
          }
          clearOnEscape
          disabled={isSubmitting || isAuthLoading}
          rows={6}
        />
      </FormControl>

      <styled.Actions>
        <Button
          $as={NextLink}
          href={returnTo}
          kind="tertiary"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={() => void handleSubmit()}
          isLoading={isSubmitting}
          disabled={isAuthLoading}
          data-testid="jwt-login-submit"
        >
          Save token
        </Button>
      </styled.Actions>
    </styled.Page>
  );
}
