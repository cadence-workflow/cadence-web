import React from 'react';
import StyletronProvider from '@/providers/styletron-provider';
import { Props } from './test-provider.types';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

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
