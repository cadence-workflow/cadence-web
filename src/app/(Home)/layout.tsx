import { redirect } from 'next/navigation';

import AppNavBar from '@/components/app-nav-bar/app-nav-bar';
import getLoginRedirect from '@/utils/auth/get-login-redirect';

export const dynamic = 'force-dynamic';

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loginRedirect = await getLoginRedirect();
  if (loginRedirect) {
    redirect(loginRedirect);
  }

  return (
    <>
      <AppNavBar />
      <main>{children}</main>
    </>
  );
}
