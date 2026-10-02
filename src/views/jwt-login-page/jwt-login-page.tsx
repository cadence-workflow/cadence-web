'use client';

import { useEffect, useMemo, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Spinner } from 'baseui/spinner';
import { Textarea } from 'baseui/textarea';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdVpnKey } from 'react-icons/md';

import cadenceLogo from '@/assets/cadence-logo-black.svg';
import { DEFAULT_AUTH_RETURN_TO } from '@/utils/auth/auth.constants';
import { isAuthLogoutNotice } from '@/utils/auth/helpers/is-auth-logout-notice';
import { sanitizeReturnTo } from '@/utils/auth/helpers/sanitize-return-to';
import { isJwtLoginReturnTo } from '@/utils/auth/strategies/jwt/jwt-login-path';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import useUserInfo from '@/views/shared/hooks/use-user-info/use-user-info';

import getNoticeMessage from './helpers/get-notice-message';
import { overrides, styled } from './jwt-login-page.styles';

export default function JwtLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: authInfo, isLoading: isAuthLoading, refetch } = useUserInfo();
  const [token, setToken] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  const returnTo = useMemo(() => {
    const sanitized = sanitizeReturnTo(searchParams.get('returnTo'));
    // /login as a destination loops back into this page (blank self-redirect).
    return isJwtLoginReturnTo(sanitized) ? DEFAULT_AUTH_RETURN_TO : sanitized;
  }, [searchParams]);
  const notice = useMemo(() => {
    const value = searchParams.get('notice');
    return isAuthLogoutNotice(value) ? value : undefined;
  }, [searchParams]);

  const isValidToken = authInfo?.auth.isValidToken === true;

  useEffect(() => {
    if (!isAuthLoading && isValidToken) {
      router.replace(returnTo);
    }
  }, [isAuthLoading, isValidToken, returnTo, router]);

  const saveToken = useMutation<void, Error | RequestError, string>(
    {
      mutationFn: async (trimmedToken) => {
        await request('/api/auth/token', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ token: trimmedToken }),
        });
        const { data } = await refetch({ throwOnError: true });
        if (data?.auth?.isValidToken !== true) {
          throw new Error('Token is expired or invalid');
        }
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries();
        router.replace(returnTo);
        router.refresh();
      },
    },
    queryClient
  );

  if (isAuthLoading) {
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
          <Spinner data-testid="jwt-login-loading" />
        </styled.Card>
      </styled.Page>
    );
  }

  // Valid session redirects — skip form flash.
  if (isValidToken) {
    return null;
  }

  const error = clientError || saveToken.error?.message || null;

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
              autoFocus
              autoComplete="off"
              disabled={saveToken.isPending}
              rows={4}
              overrides={overrides.tokenInput}
            />
          </FormControl>
        </styled.TokenField>
        <Button
          overrides={overrides.saveButton}
          onClick={() => {
            const trimmed = token.trim();
            if (!trimmed) {
              setClientError('Please paste a JWT token first');
              return;
            }
            setClientError(null);
            saveToken.mutate(trimmed);
          }}
          isLoading={saveToken.isPending}
          data-testid="jwt-login-submit"
        >
          Save token
        </Button>
      </styled.Card>
    </styled.Page>
  );
}
