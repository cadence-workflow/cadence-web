'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import PageSection from '@/components/page-section/page-section';
import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

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

  return <PageSection>{JSON.stringify(queryTypes)}</PageSection>;
}
