'use client';
import { createContext, useMemo } from 'react';

import useSuspenseClusterConfig from '@/views/shared/hooks/use-suspense-cluster-config';

import { type DomainPageContextType } from './domain-page-context-provider.types';

export const DomainPageContext = createContext<DomainPageContextType>(
  {} as DomainPageContextType
);

export default function DomainPageContextProvider({
  children,
}: {
  children: any;
}) {
  const { data: CLUSTERS_PUBLIC } = useSuspenseClusterConfig();
  const ctx = useMemo(() => {
    return { pageConfig: { CLUSTERS_PUBLIC } };
  }, [CLUSTERS_PUBLIC]);
  return (
    <DomainPageContext.Provider value={ctx}>
      {children}
    </DomainPageContext.Provider>
  );
}
