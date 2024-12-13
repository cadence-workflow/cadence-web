'use client';

import { useMemo } from 'react';

import useMergedInfiniteQueries from '@/hooks/use-merged-infinite-queries/use-merged-infinite-queries';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { type ListWorkflowsBasicRequestQueryParams } from '@/route-handlers/list-workflows-basic/list-workflows-basic.types';
import domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import DOMAIN_WORKFLOWS_BASIC_PAGE_SIZE from '../config/domain-workflows-basic-page-size.config';
import { type UseListWorkflowsBasicParams } from '../domain-workflows-basic.types';

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

  const queryConfigs = useMemo(() => {
    const requestQueryParamsBase = {
      workflowId: queryParams.workflowId,
      workflowType: queryParams.workflowType,
      timeRangeStart: queryParams.timeRangeStart?.toISOString() ?? '',
      timeRangeEnd: queryParams.timeRangeEnd?.toISOString() ?? '',
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
    queryParams.timeRangeStart,
    queryParams.timeRangeEnd,
    queryParams.statusBasic,
  ]);

  return useMergedInfiniteQueries({
    queries: queryConfigs,
    pageSize: DOMAIN_WORKFLOWS_BASIC_PAGE_SIZE,
    flattenResponse: (result) => result.workflows,
    compare: (a, b) => (a.startTime > b.startTime ? -1 : 1),
  });
}
