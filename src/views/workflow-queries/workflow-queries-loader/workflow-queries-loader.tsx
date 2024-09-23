'use client';
import React, { useMemo, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import getWorkflowQueryStatus from '../helpers/get-workflow-query-status';
import WorkflowQueriesResultJson from '../workflow-queries-result-json/workflow-queries-result-json';
import WorkflowQueriesTile from '../workflow-queries-tile/workflow-queries-tile';

import useWorkflowQueries from './hooks/use-workflow-queries';
import { EXCLUDED_QUERY_TYPES } from './workflow-queries-loader.constants';
import { styled } from './workflow-queries-loader.styles';
import { type Props } from './workflow-queries-loader.types';

export default function WorkflowQueriesLoader(props: Props) {
  const {
    data: { queryTypes },
  } = useSuspenseQuery<
    FetchWorkflowQueryTypesResponse,
    RequestError,
    FetchWorkflowQueryTypesResponse,
    [string, Props]
  >({
    queryKey: ['query_types', props] as const,
    queryFn: ({ queryKey: [_, props] }) =>
      request(
        `/api/domains/${props.domain}/${props.cluster}/workflows/${props.workflowId}/${props.runId}/query`
      ).then((res) => res.json()),
  });

  const filteredQueryTypes = useMemo(
    () => queryTypes.filter((q) => !EXCLUDED_QUERY_TYPES.has(q)),
    [queryTypes]
  );

  const [selectedQueryIndex, setSelectedQueryIndex] = useState<number>(-1);

  const { queries, inputs, setInputs } = useWorkflowQueries({
    domain: props.domain,
    cluster: props.cluster,
    workflowId: props.workflowId,
    runId: props.runId,
    queryTypes: filteredQueryTypes,
  });

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
              onClick={() => setSelectedQueryIndex(index)}
              runQuery={queries[index].refetch}
              queryStatus={getWorkflowQueryStatus({
                queryStatus: queries[index].status,
                isFetching: queries[index].isFetching,
              })}
            />
          ))}
        </styled.QueriesSidebar>
        <styled.QueryResultView>
          <WorkflowQueriesResultJson
            data={queries[selectedQueryIndex]?.data}
            error={queries[selectedQueryIndex]?.error ?? undefined}
            loading={queries[selectedQueryIndex]?.isFetching}
          />
        </styled.QueryResultView>
      </styled.PageContainer>
    </styled.PageSection>
  );
}
