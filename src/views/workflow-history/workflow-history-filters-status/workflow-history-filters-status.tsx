'use client';
import React from 'react';

import MultiSelectFilter from '@/components/multi-select-filter/multi-select-filter';
import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { HISTORY_EVENT_FILTER_STATUS_LABELS_MAP } from './workflow-history-filters-status.constants';
import { type WorkflowHistoryFiltersStatusValue } from './workflow-history-filters-status.types';

export default function WorkflowHistoryFiltersStatus({
  value,
  setValue,
}: PageFilterComponentProps<WorkflowHistoryFiltersStatusValue>) {
  return (
    <MultiSelectFilter
      label="Status"
      placeholder="All"
      values={value.historyEventStatuses ?? []}
      onChangeValues={(newValues) =>
        setValue({
          historyEventStatuses: newValues.length > 0 ? newValues : undefined,
        })
      }
      optionsLabelMap={HISTORY_EVENT_FILTER_STATUS_LABELS_MAP}
    />
  );
}
