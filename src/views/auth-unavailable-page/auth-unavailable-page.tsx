'use client';

import Image from 'next/image';

import cadenceLogo from '@/assets/cadence-logo-black.svg';

import { styled } from './auth-unavailable-page.styles';

/**
 * Static page shown when auth itself is broken. Copy doesn't mention any
 * strategy. The route sits outside (Home) so the auth gate can't redirect
 * back to it in a loop.
 */
export default function AuthUnavailablePage() {
  return (
    <styled.Page>
      <styled.Card>
        <Image
          src={cadenceLogo}
          width={48}
          height={48}
          alt="Cadence"
          priority
        />
        <styled.Title>Authentication infrastructure unavailable</styled.Title>
        <styled.Description>
          Sign-in could not be completed because the authentication
          infrastructure is unavailable or misconfigured. This is not a
          permissions problem with your account.
        </styled.Description>
        <styled.Description>
          Try again in a few minutes. If the problem persists, contact your
          Cadence deployment operator.
        </styled.Description>
      </styled.Card>
    </styled.Page>
  );
}
