'use client';
import React, { useEffect } from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import useLocalStorageValue from '@/hooks/use-local-storage-value';

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
  const typeOptionsValue =
    value.historyEventTypes?.map((type) => ({
      id: type,
      label: WORKFLOW_HISTORY_EVENT_FILTERING_TYPES_LABEL_MAP[type],
    })) ?? [];

  // const { setValue: setHistoryEventTypes } = useLocalStorageValue<
  //   Array<WorkflowHistoryEventFilteringType>
  // >({
  //   key: 'history-default-filters',
  //   encode: (val) => JSON.stringify(val),
  //   decode: (val) => JSON.parse(val),
  // });

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

          // setHistoryEventTypes(
          //   newHistoryEventTypes ?? DEFAULT_EVENT_FILTERING_TYPES
          // );

          setValue({
            historyEventTypes: newHistoryEventTypes,
          });
        }}
        placeholder="All"
      />
    </FormControl>
  );
}
