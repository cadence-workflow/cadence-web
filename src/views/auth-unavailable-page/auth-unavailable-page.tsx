'use client';

import { styled } from './auth-unavailable-page.styles';

/**
 * No-interaction status page: the terminus for authentication-infrastructure
 * failure remedies. Strategy-blind static copy — it lives outside the (Home)
 * gated route group so the layout gate never redirects it onto itself.
 */
export default function AuthUnavailablePage() {
  return (
    <styled.Page>
      <styled.Title>Authentication infrastructure unavailable</styled.Title>
      <styled.Description>
        Sign-in could not be completed because the authentication infrastructure
        is unavailable or misconfigured. This is not a permissions problem with
        your account.
      </styled.Description>
      <styled.Description>
        Try again in a few minutes. If the problem persists, contact your
        Cadence deployment operator.
      </styled.Description>
    </styled.Page>
  );
}
