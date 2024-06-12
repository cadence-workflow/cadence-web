import React from 'react';

import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

import StyletronProvider from '@/providers/styletron-provider';

import { type Props } from './test-provider.types';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

/**
 * Don't use this directly. Use render from rtl.tsx instead.
 */
export const TestProvider = ({
  children,
  router = {
    initialUrl: '/',
    pathnames: [],
  },
}: Props) => {
  return (
    <StyletronProvider>
      <MemoryRouterProvider url={router.initialUrl}>
        {children}
      </MemoryRouterProvider>
    </StyletronProvider>
  );
};
