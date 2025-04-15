import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';

import SnackbarProvider from '@/components/snackbar-provider/snackbar-provider';
import ReactQueryProvider from '@/providers/react-query-provider';

import StyletronProvider from '../providers/styletron-provider';

import StyledJsxRegistry from './registry';

import './globals.css';

const inter = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cadence',
  description:
    'Fault-Tolerant Stateful Code Platform, focus on your business logic and let Cadence take care of the complexity of distributed systems',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StyledJsxRegistry />
      <body className={inter.className}>
        <ReactQueryProvider>
          <StyletronProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </StyletronProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
