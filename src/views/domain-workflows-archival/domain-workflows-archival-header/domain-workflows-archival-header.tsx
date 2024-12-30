'use client';
import { useEffect } from 'react';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import getDateDaysBeforeToday from '@/utils/datetime/get-date-days-before-today';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import useListWorkflows from '@/views/shared/hooks/use-list-workflows';
import WorkflowsHeader from '@/views/shared/workflows-header/workflows-header';

import domainWorkflowsArchivalFiltersConfig from '../config/domain-workflows-archival-filters.config';
import DOMAIN_WORKFLOWS_ARCHIVAL_PAGE_SIZE from '../config/domain-workflows-archival-page-size.config';

import { type Props } from './domain-workflows-archival-header.types';

export default function DomainWorkflowsArchivalHeader({
  domain,
  cluster,
}: Props) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    domainPageQueryParamsConfig
  );

  const { refetch, isFetching } = useListWorkflows({
    domain,
    cluster,
    pageSize: DOMAIN_WORKFLOWS_ARCHIVAL_PAGE_SIZE,
    listType: 'archived',
    inputType: queryParams.inputTypeArchival,
    search: queryParams.searchArchival,
    status: queryParams.statusArchival,
    timeRangeStart: queryParams.timeRangeStartArchival,
    timeRangeEnd: queryParams.timeRangeEndArchival,
    sortColumn: queryParams.sortColumnArchival,
    sortOrder: queryParams.sortOrderArchival,
    query: queryParams.queryArchival,
  });

  useEffect(() => {
    if (
      !queryParams.timeRangeStartArchival &&
      !queryParams.timeRangeEndArchival
    ) {
      setQueryParams({
        timeRangeStartArchival: getDateDaysBeforeToday(10).toISOString(),
        timeRangeEndArchival: getDateDaysBeforeToday(0).toISOString(),
      });
    }
  }, [
    queryParams.timeRangeStartArchival,
    queryParams.timeRangeEndArchival,
    setQueryParams,
  ]);

  return (
    <WorkflowsHeader
      pageQueryParamsConfig={domainPageQueryParamsConfig}
      pageFiltersConfig={domainWorkflowsArchivalFiltersConfig}
      inputTypeQueryParamKey="inputTypeArchival"
      searchQueryParamKey="searchArchival"
      queryStringQueryParamKey="queryArchival"
      refetchQuery={refetch}
      isQueryRunning={isFetching}
    />
  );
}
