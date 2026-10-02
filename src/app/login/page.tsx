import { Suspense } from 'react';

import { redirect } from 'next/navigation';

import getConfigValue from '@/utils/config/get-config-value';
import JwtLoginPage from '@/views/jwt-login-page/jwt-login-page';

// Strategy check reads boot-time config — never prerender.
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const authStrategy = await getConfigValue('CADENCE_WEB_AUTH_STRATEGY');
  if (authStrategy !== 'jwt') {
    redirect('/');
  }

  // useSearchParams requires a Suspense boundary or the page CSR-bails.
  return (
    <Suspense>
      <JwtLoginPage />
    </Suspense>
  );
}
