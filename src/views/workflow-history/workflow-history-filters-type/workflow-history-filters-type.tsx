'use client';
import React, { useContext, useMemo } from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { WorkflowHistoryContext } from '../workflow-history-context-provider/workflow-history-context-provider';

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
  const {
    historyEventTypesUserPreference,
    setHistoryEventTypesUserPreference,
  } = useContext(WorkflowHistoryContext);

  const historyEventTypes = useMemo(() => {
    if (value.historyEventTypes !== undefined) return value.historyEventTypes;

    return historyEventTypesUserPreference ?? DEFAULT_EVENT_FILTERING_TYPES;
  }, [value.historyEventTypes, historyEventTypesUserPreference]);

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
            setHistoryEventTypesUserPreference(newHistoryEventTypes);
          }
        }}
        placeholder="All"
      />
    </FormControl>
  );
}
