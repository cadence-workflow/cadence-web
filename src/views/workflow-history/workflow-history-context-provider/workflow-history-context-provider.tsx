'use client';
import { createContext, useCallback, useState } from 'react';

import {
  getLocalStorageValue,
  setLocalStorageValue,
} from '@/utils/local-storage';
import useIsWorkflowHistoryV2Enabled from '@/views/workflow-history-v2/hooks/use-is-workflow-history-v2-enabled';

import workflowHistoryUserPreferencesConfig from '../config/workflow-history-user-preferences.config';

import { type WorkflowHistoryContextType } from './workflow-history-context-provider.types';

export const WorkflowHistoryContext = createContext<WorkflowHistoryContextType>(
  {} as WorkflowHistoryContextType
);

export default function WorkflowHistoryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ungroupedViewPreference, setUngroupedViewPreference] = useState(() =>
    getLocalStorageValue(
      workflowHistoryUserPreferencesConfig.ungroupedViewEnabled.key,
      workflowHistoryUserPreferencesConfig.ungroupedViewEnabled.schema
    )
  );

  const setUngroupedViewUserPreference = useCallback(
    (isUngroupedHistoryViewEnabled: boolean) => {
      setLocalStorageValue(
        workflowHistoryUserPreferencesConfig.ungroupedViewEnabled.key,
        String(isUngroupedHistoryViewEnabled)
      );
      setUngroupedViewPreference(isUngroupedHistoryViewEnabled);
    },
    []
  );

  const [isWorkflowHistoryV2Enabled, setIsWorkflowHistoryV2Enabled] =
    useIsWorkflowHistoryV2Enabled();

  return (
    <WorkflowHistoryContext.Provider
      value={{
        ungroupedViewUserPreference: ungroupedViewPreference,
        setUngroupedViewUserPreference,
        isWorkflowHistoryV2Enabled,
        setIsWorkflowHistoryV2Enabled,
      }}
    >
      {children}
    </WorkflowHistoryContext.Provider>
  );
}
