'use client';
import React from 'react';

import { FormControl } from 'baseui/form-control';
import { Select, SIZE } from 'baseui/select';

import { type PageFilterComponentProps } from '@/components/page-filters/page-filters.types';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import type domainPageQueryParamsConfig from '../config/domain-page-query-params.config';

import { WORKFLOW_STATUS_OPTIONS } from './domain-page-workflows-filters-status.constants';
import { overrides } from './domain-page-workflows-filters-status.styles';

export default function DomainPageWorkflowsFiltersStatus({
  queryParams,
  setQueryParams,
}: PageFilterComponentProps<typeof domainPageQueryParamsConfig>) {
  const statusOptionValue = WORKFLOW_STATUS_OPTIONS.filter(
    (option) => option.id === queryParams.status
  );

  return (
    <FormControl label="Status" overrides={overrides.selectFormControl}>
      <Select
        size={SIZE.compact}
        value={statusOptionValue}
        options={WORKFLOW_STATUS_OPTIONS}
        onChange={(params) =>
          setQueryParams({
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
