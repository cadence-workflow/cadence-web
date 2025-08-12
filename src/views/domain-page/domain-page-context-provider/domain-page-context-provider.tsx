'use client';
import { createContext, useMemo } from 'react';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';

import { type DomainPageContextType } from './domain-page-context-provider.types';

export const DomainPageContext = createContext<DomainPageContextType>(
  {} as DomainPageContextType
);

export default function DomainPageContextProvider({
  children,
}: {
  children: any;
}) {
  const { data: CLUSTERS_PUBLIC } = useSuspenseConfigValue('CLUSTERS_PUBLIC');
  const ctx = useMemo(() => {
    return { pageConfig: { CLUSTERS_PUBLIC } };
  }, [CLUSTERS_PUBLIC]);
  return (
    <DomainPageContext.Provider value={ctx}>
      {children}
    </DomainPageContext.Provider>
  );
}
