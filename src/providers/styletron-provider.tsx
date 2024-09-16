'use client';
import React from 'react';

import { BaseProvider, type BaseProviderOverrides, createTheme } from 'baseui';
import { Provider } from 'styletron-react';

import themeLight from '@/config/theme/theme-light.config';
import themeProviderOverrides from '@/config/theme/theme-provider-overrides.config';

import { styletron } from '../styletron';

const cadenceLightTheme = createTheme(themeLight);

export default function StyletronProvider({
  children,
  baseProviderOverrides = themeProviderOverrides,
}: {
  children: React.ReactNode;
  baseProviderOverrides?: BaseProviderOverrides;
}) {
  return (
    <Provider value={styletron}>
      <BaseProvider overrides={baseProviderOverrides} theme={cadenceLightTheme}>
        {children}
      </BaseProvider>
    </Provider>
  );
}
