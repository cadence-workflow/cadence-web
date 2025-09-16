'use client';
import React from 'react';

import MultiSelectFilter from '@/components/multi-select-filter/multi-select-filter';
import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP } from './workflow-history-filters-type.constants';
import { type WorkflowHistoryFiltersTypeValue } from './workflow-history-filters-type.types';

export default function WorkflowHistoryFiltersType({
  value,
  setValue,
}: PageFilterComponentProps<WorkflowHistoryFiltersTypeValue>) {
  return (
    <MultiSelectFilter
      label="Type"
      placeholder="All"
      values={value.historyEventTypes ?? []}
      onChangeValues={(newValues) =>
        setValue({
          historyEventTypes: newValues.length > 0 ? newValues : undefined,
        })
      }
      optionsLabelMap={WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP}
    />
  );
}
