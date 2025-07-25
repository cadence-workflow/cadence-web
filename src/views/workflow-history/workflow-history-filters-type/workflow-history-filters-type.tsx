'use client';
import React, { useEffect } from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import useLocalStorageValue from '@/hooks/use-local-storage-value';

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

  const { getValue: getHistoryEventTypes, setValue: setHistoryEventTypes } =
    useLocalStorageValue<Array<WorkflowHistoryEventFilteringType> | undefined>({
      key: 'history-default-filters',
      encode: (val) => JSON.stringify(val),
      decode: (val) => JSON.parse(val),
    });

  useEffect(() => {
    const storageHistoryTypesToFilter = getHistoryEventTypes();

    if (storageHistoryTypesToFilter !== null) {
      setValue({
        historyEventTypes: storageHistoryTypesToFilter,
      });
    }

    // We want to run this useEffect only on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormControl label="Type" overrides={overrides.selectFormControl}>
      <Select
        multi
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

          setHistoryEventTypes(newHistoryEventTypes);

          setValue({
            historyEventTypes: newHistoryEventTypes,
          });
        }}
        placeholder="All"
      />
    </FormControl>
  );
}
