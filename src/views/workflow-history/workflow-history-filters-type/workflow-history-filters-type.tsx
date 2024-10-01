'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_OPTIONS } from './workflow-history-filters-type.constants';
import { overrides } from './workflow-history-filters-type.styles';
import {
  type WokflowHistoryEventFilteringType,
  type WorkflowHistoryFiltersTypeValue,
} from './workflow-history-filters-type.types';

export default function WorkflowHistoryFiltersType({
  value,
  setValue,
}: PageFilterComponentProps<WorkflowHistoryFiltersTypeValue>) {
  const statusOptionValue =
    WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_OPTIONS.filter(
      (option) => option.id === value.historyEventType
    );

  return (
    <FormControl label="Type" overrides={overrides.selectFormControl}>
      <Select
        size={SIZE.compact}
        value={statusOptionValue}
        options={WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_OPTIONS}
        onChange={(params) =>
          setValue({
            historyEventType:
              WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_OPTIONS.find(
                (opt) => opt.id === params.value[0]?.id
              )
                ? (String(
                    params.value[0]?.id
                  ) as WokflowHistoryEventFilteringType)
                : undefined,
          })
        }
        placeholder="All"
      />
    </FormControl>
  );
}
