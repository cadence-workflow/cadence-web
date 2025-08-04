'use client';
import { createContext, useCallback, useState } from 'react';

import {
  clearLocalStorageValue,
  getLocalStorageValue,
  setLocalStorageValue,
} from '@/utils/local-storage';

import workflowHistoryUserPreferencesConfig from '../config/workflow-history-user-preferences.config';
import { type WorkflowHistoryEventFilteringType } from '../workflow-history-filters-type/workflow-history-filters-type.types';

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

  const [historyEventTypesPreference, setHistoryEventTypesPreference] =
    useState(() =>
      getLocalStorageValue(
        workflowHistoryUserPreferencesConfig.historyEventTypes.key,
        workflowHistoryUserPreferencesConfig.historyEventTypes.schema
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

  const setHistoryEventTypesUserPreference = useCallback(
    (historyEventTypes: Array<WorkflowHistoryEventFilteringType>) => {
      setLocalStorageValue(
        workflowHistoryUserPreferencesConfig.historyEventTypes.key,
        JSON.stringify(historyEventTypes)
      );
      setHistoryEventTypesPreference(historyEventTypes);
    },
    []
  );

  const clearHistoryEventTypesUserPreference = useCallback(() => {
    clearLocalStorageValue(
      workflowHistoryUserPreferencesConfig.historyEventTypes.key
    );
    setHistoryEventTypesPreference(null);
  }, []);

  return (
    <WorkflowHistoryContext.Provider
      value={{
        ungroupedViewUserPreference: ungroupedViewPreference,
        setUngroupedViewUserPreference,
        historyEventTypesUserPreference: historyEventTypesPreference,
        setHistoryEventTypesUserPreference,
        clearHistoryEventTypesUserPreference,
      }}
    >
      {children}
    </WorkflowHistoryContext.Provider>
  );
}
