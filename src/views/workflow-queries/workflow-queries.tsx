'use client';

import React, { useEffect, useMemo, useRef } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import ErrorPanel from '@/components/error-panel/error-panel';
import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import PanelSection from '@/components/panel-section/panel-section';
import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import workflowPageQueryParamsConfig from '@/views/workflow-page/config/workflow-page-query-params.config';
import { type WorkflowPageTabContentProps } from '@/views/workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import workflowQueriesEmptyPanelConfig from './config/workflow-queries-empty-panel.config';
import getWorkflowQueryStatus from './helpers/get-workflow-query-status';
import useWorkflowQueries from './hooks/use-workflow-queries';
import WorkflowQueriesResult from './workflow-queries-result/workflow-queries-result';
import WorkflowQueriesTile from './workflow-queries-tile/workflow-queries-tile';
import { EXCLUDED_QUERY_TYPES_SET } from './workflow-queries.constants';
import { styled } from './workflow-queries.styles';
import { type WorkflowQueryURLParams } from './workflow-queries.types';

export default function WorkflowQueries(props: WorkflowPageTabContentProps) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    workflowPageQueryParamsConfig,
    { pageRerender: false, replace: true }
  );

  const {
    data: { queryTypes },
  } = useSuspenseQuery<
    FetchWorkflowQueryTypesResponse,
    RequestError,
    FetchWorkflowQueryTypesResponse,
    [string, WorkflowQueryURLParams]
  >({
    queryKey: ['query_types', props.params] as const,
    queryFn: ({ queryKey: [_, props] }) =>
      request(
        `/api/domains/${props.domain}/${props.cluster}/workflows/${props.workflowId}/${props.runId}/query`
      ).then((res) => res.json()),
  });

  const filteredQueryTypes = useMemo(
    () => queryTypes.filter((q) => !EXCLUDED_QUERY_TYPES_SET.has(q)),
    [queryTypes]
  );

  const selectedQueryIndex = useMemo(
    () =>
      queryParams.selectedQueryName
        ? filteredQueryTypes.indexOf(queryParams.selectedQueryName)
        : -1,
    [queryParams.selectedQueryName, filteredQueryTypes]
  );

  const { queries, inputs, setInputs } = useWorkflowQueries({
    ...props.params,
    queryTypes: filteredQueryTypes,
  });

  // Auto-run the selected query when arriving via deep link (?q=...).
  // initialQueryName ensures this only fires on initial page load, not on subsequent tile clicks.
  const initialQueryName = useRef(queryParams.selectedQueryName);
  const hasAutoRun = useRef(false);
  useEffect(() => {
    if (
      !hasAutoRun.current &&
      initialQueryName.current &&
      selectedQueryIndex >= 0 &&
      queries[selectedQueryIndex] &&
      !queries[selectedQueryIndex].isFetching
    ) {
      hasAutoRun.current = true;
      queries[selectedQueryIndex].refetch();
    }
  }, [selectedQueryIndex, queries]);

  if (filteredQueryTypes.length === 0) {
    return (
      <PanelSection>
        <ErrorPanel {...workflowQueriesEmptyPanelConfig} />
      </PanelSection>
    );
  }

  return (
    <styled.PageSection>
      <styled.PageContainer>
        <styled.QueriesSidebar>
          {filteredQueryTypes.map((name, index) => (
            <WorkflowQueriesTile
              key={name}
              name={name}
              input={inputs[name]}
              onChangeInput={(v) =>
                setInputs((oldInputs) => ({ ...oldInputs, [name]: v }))
              }
              isSelected={index === selectedQueryIndex}
              onClick={() =>
                setQueryParams({ selectedQueryName: name })
              }
              runQuery={queries[index].refetch}
              queryStatus={getWorkflowQueryStatus({
                queryStatus: queries[index].status,
                isFetching: queries[index].isFetching,
              })}
            />
          ))}
        </styled.QueriesSidebar>
        <styled.QueryResultView>
          <WorkflowQueriesResult
            data={queries[selectedQueryIndex]?.data}
            error={queries[selectedQueryIndex]?.error ?? undefined}
            loading={queries[selectedQueryIndex]?.isFetching}
            domain={props.params.domain}
            cluster={props.params.cluster}
            workflowId={props.params.workflowId}
            runId={props.params.runId}
          />
        </styled.QueryResultView>
      </styled.PageContainer>
    </styled.PageSection>
  );
}
