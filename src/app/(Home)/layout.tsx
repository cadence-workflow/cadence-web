import { redirect } from 'next/navigation';

import AppNavBar from '@/components/app-nav-bar/app-nav-bar';
import AuthSessionWatcher from '@/components/auth-session-watcher/auth-session-watcher';
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
      <AuthSessionWatcher />
      <AppNavBar />
      <main>{children}</main>
    </>
  );
}
