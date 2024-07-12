'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import { type DomainPageWorkflowFiltersStatusValue } from './domain-page-workflow-filters-status-types';
import { WORKFLOW_STATUS_OPTIONS } from './domain-page-workflows-filters-status.constants';
import { overrides } from './domain-page-workflows-filters-status.styles';

export default function DomainPageWorkflowsFiltersStatus({
  value,
  setValue,
}: PageFilterComponentProps<DomainPageWorkflowFiltersStatusValue>) {
  const statusOptionValue = WORKFLOW_STATUS_OPTIONS.filter(
    (option) => option.id === value.status
  );

  return (
    <FormControl label="Status" overrides={overrides.selectFormControl}>
      <Select
        size={SIZE.compact}
        value={statusOptionValue}
        options={WORKFLOW_STATUS_OPTIONS}
        onChange={(params) =>
          setValue({
            status: WORKFLOW_STATUS_OPTIONS.find(
              (opt) => opt.id === params.value[0]?.id
            )
              ? (String(params.value[0]?.id) as WorkflowStatus)
              : undefined,
          })
        }
        placeholder="Show all statuses"
      />
    </FormControl>
  );
}
