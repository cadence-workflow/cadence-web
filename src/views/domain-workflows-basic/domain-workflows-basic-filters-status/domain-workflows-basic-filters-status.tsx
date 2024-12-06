'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import { WORKFLOW_STATUS_OPTIONS_BASIC_VISIBILITY } from './domain-workflows-basic-filters-status.constants';
import { overrides } from './domain-workflows-basic-filters-status.styles';
import { type DomainWorkflowsBasicFiltersStatusValue } from './domain-workflows-basic-filters-status.types';

export default function DomainWorkflowsBasicFiltersStatus({
  value,
  setValue,
}: PageFilterComponentProps<DomainWorkflowsBasicFiltersStatusValue>) {
  const statusOptionValue = WORKFLOW_STATUS_OPTIONS_BASIC_VISIBILITY.filter(
    (option) => option.id === value.statusBasic
  );

  return (
    <FormControl label="Status" overrides={overrides.selectFormControl}>
      <Select
        size={SIZE.compact}
        value={statusOptionValue}
        options={WORKFLOW_STATUS_OPTIONS_BASIC_VISIBILITY}
        onChange={(params) =>
          setValue({
            statusBasic: WORKFLOW_STATUS_OPTIONS_BASIC_VISIBILITY.find(
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
