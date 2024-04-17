'use client';
import React from 'react';
import { Provider } from 'styletron-react';
import { styletron } from '../styletron';
import { BaseProvider, createTheme } from 'baseui';
import themeProviderOverrides from '@/config/theme/theme-provider-overrides.config';
import themeLight from '@/config/theme/theme-light.config';

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
