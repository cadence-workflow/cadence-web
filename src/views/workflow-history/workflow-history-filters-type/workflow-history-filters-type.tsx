'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP } from './workflow-history-filters-type.constants';
import { overrides } from './workflow-history-filters-type.styles';
import {
  type WorkflowHistoryEventFilteringType,
  type WorkflowHistoryFiltersTypeValue,
} from './workflow-history-filters-type.types';

export default function WorkflowHistoryFiltersType({
  value,
  setValue,
}: PageFilterComponentProps<WorkflowHistoryFiltersTypeValue>) {
  const typeOptionsValue =
    value.historyEventTypes?.map((type) => ({
      id: type,
      label: WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP[type],
    })) ?? [];

  return (
    <FormControl label="Type" overrides={overrides.selectFormControl}>
      <Select
        multi
        size={SIZE.compact}
        value={typeOptionsValue}
        options={Object.entries(
          WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP
        ).map(([id, label]) => ({ id, label }))}
        onChange={(params) =>
          setValue({
            historyEventTypes:
              params.value.length > 0
                ? params.value.map(
                    (v) => v.id as WorkflowHistoryEventFilteringType
                  )
                : undefined,
          })
        }
        placeholder="All"
      />
    </FormControl>
  );
}
