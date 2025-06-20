'use client';
import React from 'react';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import { type DomainPageTabContentProps } from '@/views/domain-page/domain-page-content/domain-page-content.types';

import domainPageQueryParamsConfig from '../domain-page/config/domain-page-query-params.config';

import domainWorkflowsBasicFiltersConfig from './config/domain-workflows-basic-filters.config';
import DomainWorkflowsBasicFilters from './domain-workflows-basic-filters/domain-workflows-basic-filters';
import DomainWorkflowsBasicTable from './domain-workflows-basic-table/domain-workflows-basic-table';

export default function DomainWorkflowsBasic(props: DomainPageTabContentProps) {
  const { resetAllFilters, activeFiltersCount, queryParams, setQueryParams } =
    usePageFilters({
      pageFiltersConfig: domainWorkflowsBasicFiltersConfig,
      pageQueryParamsConfig: domainPageQueryParamsConfig,
    });

  return (
    <>
      <DomainWorkflowsBasicFilters
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        activeFiltersCount={activeFiltersCount}
        resetAllFilters={resetAllFilters}
      />
      <DomainWorkflowsBasicTable
        domain={props.domain}
        cluster={props.cluster}
        areAnyFiltersActive={Boolean(
          activeFiltersCount > 0 ||
            queryParams.workflowId ||
            queryParams.workflowType
        )}
      />
    </>
  );
}
