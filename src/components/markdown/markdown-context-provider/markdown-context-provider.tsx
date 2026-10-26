'use client';
import { createContext, useMemo } from 'react';

import {
  type MarkdownContextType,
  type Props,
} from './markdown-context-provider.types';

export const MarkdownContext = createContext<MarkdownContextType>({});

export default function MarkdownContextProvider({
  domain,
  cluster,
  workflowId,
  runId,
  onActionSuccess,
  children,
}: Props) {
  const contextValue = useMemo(
    () => ({ domain, cluster, workflowId, runId, onActionSuccess }),
    [domain, cluster, workflowId, runId, onActionSuccess]
  );

  return (
    <MarkdownContext.Provider value={contextValue}>
      {children}
    </MarkdownContext.Provider>
  );
}
