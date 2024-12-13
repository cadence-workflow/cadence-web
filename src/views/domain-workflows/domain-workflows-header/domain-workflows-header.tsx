'use client';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import WorkflowsHeader from '@/views/shared/workflows-header/workflows-header';

import domainWorkflowsFiltersConfig from '../config/domain-workflows-filters.config';

import { type Props } from './domain-workflows-header.types';

export default function DomainWorkflowsHeader({ domain, cluster }: Props) {
  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  return (
    <WorkflowsHeader
      domain={domain}
      cluster={cluster}
      pageQueryParamsConfig={domainPageQueryParamsConfig}
      pageFiltersConfig={domainWorkflowsFiltersConfig}
      filtersValues={{
        inputType: queryParams.inputType,
        search: queryParams.search,
        status: queryParams.status,
        timeRangeStart: queryParams.timeRangeStart,
        timeRangeEnd: queryParams.timeRangeEnd,
        sortColumn: queryParams.sortColumn,
        sortOrder: queryParams.sortOrder,
        query: queryParams.query,
      }}
      inputTypeQueryParamKey="inputType"
      searchQueryParamKey="search"
      queryStringQueryParamKey="query"
    />
  );
}
