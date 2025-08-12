'use client';
import { createContext, useMemo } from 'react';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';

import { type DomainsPageContextType } from './domains-page-context-provider.types';

export const DomainsPageContext = createContext<DomainsPageContextType>(
  {} as DomainsPageContextType
);

export default function DomainsPageContextProvider({
  children,
}: {
  children: any;
}) {
  const { data: CLUSTERS_PUBLIC } = useSuspenseConfigValue('CLUSTERS_PUBLIC');
  const ctx = useMemo(() => {
    return { pageConfig: { CLUSTERS_PUBLIC } };
  }, [CLUSTERS_PUBLIC]);
  return (
    <DomainsPageContext.Provider value={ctx}>
      {children}
    </DomainsPageContext.Provider>
  );
}
