'use client';
import React, { useState } from 'react';

import { useQueries, useSuspenseQuery } from '@tanstack/react-query';

import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import WorkflowQueriesResultJson from '../workflow-queries-result-json/workflow-queries-result-json';
import WorkflowQueriesTile from '../workflow-queries-tile/workflow-queries-tile';

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

  const [selectedQueryIndex, setSelectedQueryIndex] = useState<number>(-1);
  const [inputs, setInputs] = useState<Record<string, string | undefined>>({});

  // TODO: when the queries are ready, add their generic types here
  const queries = useQueries({
    queries: queryTypes.map((name) => ({
      queryKey: [name, inputs[name]] as const,
      queryFn: ({
        queryKey: [name, input],
      }: {
        queryKey: readonly [string, string | undefined];
      }) => {
        // TODO: add the actual query here
        return { name, input };
      },
      enabled: false,
    })),
  });

  return (
    <styled.PageContainer>
      <styled.QueriesSidebar>
        {queryTypes.map((name, index) => (
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
            queryStatus={queries[index].status}
          />
        ))}
      </styled.QueriesSidebar>
      <styled.QueryResultView>
        <WorkflowQueriesResultJson
          data={queries[selectedQueryIndex]?.data}
          error={queries[selectedQueryIndex]?.error}
          loading={queries[selectedQueryIndex]?.isFetching}
        />
      </styled.QueryResultView>
    </styled.PageContainer>
  );
}
