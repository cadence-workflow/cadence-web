'use client';

import { useMemo } from 'react';

import getDayjsFromDateFilterValue from '@/components/date-filter-v2/helpers/get-dayjs-from-date-filter-value';
import useMergedInfiniteQueries from '@/hooks/use-merged-infinite-queries/use-merged-infinite-queries';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { type ListWorkflowsBasicRequestQueryParams } from '@/route-handlers/list-workflows-basic/list-workflows-basic.types';
import dayjs from '@/utils/datetime/dayjs';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import DOMAIN_WORKFLOWS_BASIC_PAGE_SIZE from '../config/domain-workflows-basic-page-size.config';
import { type UseListWorkflowsBasicParams } from '../domain-workflows-basic.types';

import compareBasicVisibilityWorkflows from './helpers/compare-basic-visibility-workflows';
import getListWorkflowsBasicQueryOptions from './helpers/get-list-workflows-basic-query-options';

export default function useListWorkflowsBasic({
  domain,
  cluster,
  pageSize = DOMAIN_WORKFLOWS_BASIC_PAGE_SIZE,
}: UseListWorkflowsBasicParams) {
  const [queryParams] = usePageQueryParams(domainPageQueryParamsConfig);

  const loadOpenWorkflows =
    queryParams.statusBasic === undefined ||
    queryParams.statusBasic === 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';

  const loadClosedWorkflows =
    queryParams.statusBasic === undefined ||
    queryParams.statusBasic !== 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';

  const timeRangeParams = useMemo(() => {
    const now = dayjs();

    return {
      timeRangeStart: getDayjsFromDateFilterValue(
        queryParams.timeRangeStartBasic,
        now
      ).toISOString(),
      timeRangeEnd: getDayjsFromDateFilterValue(
        queryParams.timeRangeEndBasic,
        now
      ).toISOString(),
    };
  }, [queryParams.timeRangeStartBasic, queryParams.timeRangeEndBasic]);

  const queryConfigs = useMemo(() => {
    const requestQueryParamsBase = {
      workflowId: queryParams.workflowId,
      workflowType: queryParams.workflowType,
      ...timeRangeParams,
      pageSize: pageSize.toString(),
      ...(queryParams.statusBasic !== 'ALL_CLOSED' &&
      queryParams.statusBasic !== 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
        ? {
            closeStatus: queryParams.statusBasic,
          }
        : {}),
    } as const satisfies Omit<ListWorkflowsBasicRequestQueryParams, 'kind'>;

    return [
      ...(loadOpenWorkflows
        ? [
            getListWorkflowsBasicQueryOptions({
              domain,
              cluster,
              requestQueryParams: {
                ...requestQueryParamsBase,
                kind: 'open',
              },
            }),
          ]
        : []),
      ...(loadClosedWorkflows
        ? [
            getListWorkflowsBasicQueryOptions({
              domain,
              cluster,
              requestQueryParams: {
                ...requestQueryParamsBase,
                kind: 'closed',
              },
            }),
          ]
        : []),
    ];
  }, [
    domain,
    cluster,
    pageSize,
    loadOpenWorkflows,
    loadClosedWorkflows,
    queryParams.workflowId,
    queryParams.workflowType,
    timeRangeParams,
    queryParams.statusBasic,
  ]);

  return useMergedInfiniteQueries({
    queries: queryConfigs,
    pageSize: DOMAIN_WORKFLOWS_BASIC_PAGE_SIZE,
    flattenResponse: (result) => result.workflows,
    compare: compareBasicVisibilityWorkflows,
  });
}
