'use client';
import React from 'react';

import { BaseProvider, type BaseProviderOverrides, createTheme } from 'baseui';
import { Provider } from 'styletron-react';
import { type StandardEngine } from 'styletron-standard';

import themeLight from '@/config/theme/theme-light.config';
import themeProviderOverrides from '@/config/theme/theme-provider-overrides.config';

import { styletron } from '../styletron';

const cadenceLightTheme = createTheme(themeLight);

export default function StyletronProvider({
  children,
  baseProviderOverrides = themeProviderOverrides,
  styletronEngine = styletron,
}: {
  children: React.ReactNode;
  baseProviderOverrides?: BaseProviderOverrides;
  styletronEngine?: StandardEngine;
}) {
  return (
    <Provider value={styletronEngine}>
      <BaseProvider overrides={baseProviderOverrides} theme={cadenceLightTheme}>
        {children}
      </BaseProvider>
    </Provider>
  );
}
