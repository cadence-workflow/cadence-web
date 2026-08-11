'use client';
import { createContext, useCallback, useState } from 'react';

import {
  getLocalStorageValue,
  setLocalStorageValue,
} from '@/utils/local-storage';
import useIsWorkflowHistoryV2Selected from '@/views/workflow-history-v2/hooks/use-is-workflow-history-v2-selected';

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

  const [isWorkflowHistoryV2Selected, setIsWorkflowHistoryV2Selected] =
    useIsWorkflowHistoryV2Selected();

  return (
    <WorkflowHistoryContext.Provider
      value={{
        ungroupedViewUserPreference: ungroupedViewPreference,
        setUngroupedViewUserPreference,
        isWorkflowHistoryV2Selected,
        setIsWorkflowHistoryV2Selected,
      }}
    >
      {children}
    </WorkflowHistoryContext.Provider>
  );
}
