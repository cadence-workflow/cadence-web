'use client';
import { createContext, useMemo } from 'react';

import useSuspenseClusterConfig from '@/views/shared/hooks/use-suspense-cluster-config';

import { type DomainsPageContextType } from './domains-page-context-provider.types';

export const DomainsPageContext = createContext<DomainsPageContextType>(
  {} as DomainsPageContextType
);

export default function DomainsPageContextProvider({
  children,
}: {
  children: any;
}) {
  const { data: CLUSTERS_PUBLIC } = useSuspenseClusterConfig();
  const ctx = useMemo(() => {
    return { pageConfig: { CLUSTERS_PUBLIC } };
  }, [CLUSTERS_PUBLIC]);
  return (
    <DomainsPageContext.Provider value={ctx}>
      {children}
    </DomainsPageContext.Provider>
  );
}
