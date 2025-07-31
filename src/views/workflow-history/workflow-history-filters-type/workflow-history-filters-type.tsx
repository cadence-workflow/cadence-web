'use client';
import React, { useMemo } from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from '@/utils/local-storage';

import workflowHistoryUserPreferencesConfig from '../config/workflow-history-user-preferences.config';

import {
  DEFAULT_EVENT_FILTERING_TYPES,
  WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP,
} from './workflow-history-filters-type.constants';
import { overrides } from './workflow-history-filters-type.styles';
import {
  type WorkflowHistoryEventFilteringType,
  type WorkflowHistoryFiltersTypeValue,
} from './workflow-history-filters-type.types';

export default function WorkflowHistoryFiltersType({
  value,
  setValue,
}: PageFilterComponentProps<WorkflowHistoryFiltersTypeValue>) {
  const eventTypesPreference = getLocalStorageValue(
    workflowHistoryUserPreferencesConfig.historyEventTypes.key,
    workflowHistoryUserPreferencesConfig.historyEventTypes.schema
  );

  const historyEventTypes = useMemo(() => {
    if (value.historyEventTypes !== undefined) return value.historyEventTypes;

    return eventTypesPreference ?? DEFAULT_EVENT_FILTERING_TYPES;
  }, [value.historyEventTypes, eventTypesPreference]);

  const typeOptionsValue =
    historyEventTypes.map((type: WorkflowHistoryEventFilteringType) => ({
      id: type,
      label: WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP[type],
    })) ?? [];

  return (
    <FormControl label="Type" overrides={overrides.selectFormControl}>
      <Select
        multi
        clearable={false}
        size={SIZE.compact}
        value={typeOptionsValue}
        options={Object.entries(
          WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP
        ).map(([id, label]) => ({ id, label }))}
        onChange={(params) => {
          const newHistoryEventTypes =
            params.value.length > 0
              ? params.value.map(
                  (v) => v.id as WorkflowHistoryEventFilteringType
                )
              : undefined;

          setValue({
            historyEventTypes: newHistoryEventTypes,
          });

          if (newHistoryEventTypes) {
            setLocalStorageValue(
              workflowHistoryUserPreferencesConfig.historyEventTypes.key,
              JSON.stringify(newHistoryEventTypes)
            );
          }
        }}
        placeholder="All"
      />
    </FormControl>
  );
}
