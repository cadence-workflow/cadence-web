'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { type WorkflowEventStatus } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';

import { WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_LABELS_MAP } from './workflow-history-filters-status.constants';
import { overrides } from './workflow-history-filters-status.styles';
import { type WorkflowHistoryFiltersStatusValue } from './workflow-history-filters-status.types';

export default function WorkflowHistoryFiltersStatus({
  value,
  setValue,
}: PageFilterComponentProps<WorkflowHistoryFiltersStatusValue>) {
  const statusOptionsValue =
    value.historyEventStatuses?.map((status) => ({
      id: status,
      label: WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_LABELS_MAP[status],
    })) ?? [];

  return (
    <FormControl label="Status" overrides={overrides.selectFormControl}>
      <Select
        multi
        size={SIZE.compact}
        value={statusOptionsValue}
        options={Object.entries(
          WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_LABELS_MAP
        ).map(([id, label]) => ({
          id,
          label,
        }))}
        onChange={(params) => {
          setValue({
            historyEventStatuses:
              params.value.length > 0
                ? params.value.map((v) => v.id as WorkflowEventStatus)
                : undefined,
          });
        }}
        placeholder="All"
      />
    </FormControl>
  );
}
