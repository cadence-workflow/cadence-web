import { Suspense } from 'react';

import { redirect } from 'next/navigation';

import getConfigValue from '@/utils/config/get-config-value';
import JwtLoginPage from '@/views/jwt-login-page/jwt-login-page';

// The strategy check reads configs loaded at server boot — never prerender.
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  // /login is the jwt strategy's own surface: under any other strategy there
  // is no token form, so the page redirects to `/`. The check lives in this
  // page — not in a shared component — and reads config directly, so the
  // client form never renders for a strategy that cannot use it.
  const authStrategy = await getConfigValue('CADENCE_WEB_AUTH_STRATEGY');
  if (authStrategy !== 'jwt') {
    redirect('/');
  }

  return (
    // Suspense boundary: JwtLoginPage reads useSearchParams, which bails to
    // client-side rendering without one.
    <Suspense>
      <JwtLoginPage />
    </Suspense>
  );
}
