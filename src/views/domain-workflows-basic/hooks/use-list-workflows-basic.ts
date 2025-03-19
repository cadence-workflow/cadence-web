'use client';

import { useMemo } from 'react';

import useMergedInfiniteQueries from '@/hooks/use-merged-infinite-queries/use-merged-infinite-queries';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { type ListWorkflowsBasicRequestQueryParams } from '@/route-handlers/list-workflows-basic/list-workflows-basic.types';
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

  const queryConfigs = useMemo(() => {
    const requestQueryParamsBase = {
      workflowId: queryParams.workflowId,
      workflowType: queryParams.workflowType,
      timeRangeStart: queryParams.timeRangeStartBasic.toISOString(),
      timeRangeEnd: queryParams.timeRangeEndBasic.toISOString(),
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
    queryParams.timeRangeStartBasic,
    queryParams.timeRangeEndBasic,
    queryParams.statusBasic,
  ]);

  return useMergedInfiniteQueries({
    queries: queryConfigs,
    pageSize: DOMAIN_WORKFLOWS_BASIC_PAGE_SIZE,
    flattenResponse: (result) => result.workflows,
    compare: compareBasicVisibilityWorkflows,
  });
}
