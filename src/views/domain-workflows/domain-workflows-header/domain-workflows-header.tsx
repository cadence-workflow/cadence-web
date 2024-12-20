'use client';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import WorkflowsHeader from '@/views/shared/workflows-header/workflows-header';

import domainWorkflowsFiltersConfig from '../config/domain-workflows-filters.config';
import DOMAIN_WORKFLOWS_PAGE_SIZE from '../config/domain-workflows-page-size.config';

import { type Props } from './domain-workflows-header.types';

export default function DomainWorkflowsHeader({ domain, cluster }: Props) {
  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  const { refetch, isFetching } = useListWorkflows({
    domain,
    cluster,
    filtersValues: {
      inputType: queryParams.inputType,
      search: queryParams.search,
      status: queryParams.status,
      timeRangeStart: queryParams.timeRangeStart,
      timeRangeEnd: queryParams.timeRangeEnd,
      sortColumn: queryParams.sortColumn,
      sortOrder: queryParams.sortOrder,
      query: queryParams.query,
    },
    pageSize: DOMAIN_WORKFLOWS_PAGE_SIZE,
  });

  return (
    <WorkflowsHeader
      pageQueryParamsConfig={domainPageQueryParamsConfig}
      pageFiltersConfig={domainWorkflowsFiltersConfig}
      inputTypeQueryParamKey="inputType"
      searchQueryParamKey="search"
      queryStringQueryParamKey="query"
      refetchQuery={refetch}
      isQueryRunning={isFetching}
    />
  );
}
