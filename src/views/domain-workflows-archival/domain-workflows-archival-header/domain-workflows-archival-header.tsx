'use client';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import WorkflowsHeader from '@/views/shared/workflows-header/workflows-header';

import domainWorkflowsArchivalFiltersConfig from '../config/domain-workflows-archival-filters.config';
import DOMAIN_WORKFLOWS_ARCHIVAL_PAGE_SIZE from '../config/domain-workflows-archival-page-size.config';

import { type Props } from './domain-workflows-archival-header.types';

export default function DomainWorkflowsArchivalHeader({
  domain,
  cluster,
  timeRangeStart,
  timeRangeEnd,
}: Props) {
  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  const { refetch, isFetching } = useListWorkflows({
    domain,
    cluster,
    pageSize: DOMAIN_WORKFLOWS_ARCHIVAL_PAGE_SIZE,
    listType: 'archived',
    inputType: queryParams.inputTypeArchival,
    search: queryParams.searchArchival,
    statuses: queryParams.statusesArchival,
    timeRangeStart,
    timeRangeEnd,
    sortColumn: queryParams.sortColumnArchival,
    sortOrder: queryParams.sortOrderArchival,
    query: queryParams.queryArchival,
  });

  return (
    <WorkflowsHeader
      pageQueryParamsConfig={domainPageQueryParamsConfig}
      pageFiltersConfig={domainWorkflowsArchivalFiltersConfig}
      inputTypeQueryParamKey="inputTypeArchival"
      searchQueryParamKey="searchArchival"
      queryStringQueryParamKey="queryArchival"
      refetchQuery={refetch}
      isQueryRunning={isFetching}
      expandFiltersByDefault={true}
    />
  );
}
