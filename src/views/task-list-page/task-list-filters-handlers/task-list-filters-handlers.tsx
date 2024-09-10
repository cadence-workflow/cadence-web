'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type TaskListType } from '@/__generated__/proto-ts/uber/cadence/api/v1/TaskListType';
import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';

import { TASK_LIST_HANDLERS_OPTIONS } from './task-list-filters-handlers.constants';
import { overrides } from './task-list-filters-handlers.styles';
import { type TaskListFiltersHandlersValue } from './task-list-filters-handlers.types';

export default function TaskListFiltersHandlers({
  value,
  setValue,
}: PageFilterComponentProps<TaskListFiltersHandlersValue>) {
  const typeOptionValue = TASK_LIST_HANDLERS_OPTIONS.filter(
    (option) => option.id === value.handlerType
  );

  return (
    <FormControl label="Handlers" overrides={overrides.selectFormControl}>
      <Select
        size={SIZE.compact}
        value={typeOptionValue}
        options={TASK_LIST_HANDLERS_OPTIONS}
        onChange={(params) =>
          setValue({
            handlerType: TASK_LIST_HANDLERS_OPTIONS.find(
              (opt) => opt.id === params.value[0]?.id
            )
              ? (String(params.value[0]?.id) as TaskListType)
              : undefined,
          })
        }
        placeholder="Show all handlers"
      />
    </FormControl>
  );
}
