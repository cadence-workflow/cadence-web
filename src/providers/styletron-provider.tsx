'use client';
import React from 'react';

import { BaseProvider, createTheme } from 'baseui';
import { Provider } from 'styletron-react';

import themeLight from '@/config/theme/theme-light.config';
import themeProviderOverrides from '@/config/theme/theme-provider-overrides.config';

import { styletron } from '../styletron';

const cadenceLightTheme = createTheme(themeLight);

export default function StyletronProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider value={styletron}>
      <BaseProvider
        overrides={themeProviderOverrides}
        theme={cadenceLightTheme}
      >
        {children}
      </BaseProvider>
    </Provider>
  );
}
