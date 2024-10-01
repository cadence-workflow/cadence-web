'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { type WorkflowEventStatus } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';

import { WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_OPTIONS } from './workflow-history-filters-status.constants';
import { overrides } from './workflow-history-filters-status.styles';
import { type WorkflowHistoryFiltersStatusValue } from './workflow-history-filters-status.types';

export default function WorkflowHistoryFiltersStatus({
  value,
  setValue,
}: PageFilterComponentProps<WorkflowHistoryFiltersStatusValue>) {
  const statusOptionValue =
    WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_OPTIONS.filter(
      (option) => option.id === value.historyEventStatus
    );

  return (
    <FormControl label="Status" overrides={overrides.selectFormControl}>
      <Select
        size={SIZE.compact}
        value={statusOptionValue}
        options={WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_OPTIONS}
        onChange={(params) =>
          setValue({
            historyEventStatus:
              WORKFLOW_HISTORY_EVENT_FILTERING_STATUS_OPTIONS.find(
                (opt) => opt.id === params.value[0]?.id
              )
                ? (String(params.value[0]?.id) as WorkflowEventStatus)
                : undefined,
          })
        }
        placeholder="All"
      />
    </FormControl>
  );
}
