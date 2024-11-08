import { useState } from 'react';

import { useQueries, type UseQueryOptions } from '@tanstack/react-query';

import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

export default function useWorkflowQueries({
  domain,
  cluster,
  workflowId,
  runId,
  queryTypes,
}: {
  domain: string;
  cluster: string;
  workflowId: string;
  runId: string;
  queryTypes: Array<string>;
}) {
  const [inputs, setInputs] = useState<Record<string, string | undefined>>({});

  const queries = useQueries({
    queries: queryTypes.map<
      UseQueryOptions<
        QueryWorkflowResponse,
        RequestError,
        QueryWorkflowResponse,
        [
          'workflow_query',
          { workflowId: string; runId: string; name: string },
          string | undefined,
        ]
      >
    >((name) => ({
      queryKey: [
        'workflow_query',
        { workflowId, runId, name },
        inputs[name],
      ] as const,
      queryFn: ({ queryKey: [_, { name }, input] }) =>
        request(
          `/api/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/query/${name}`,
          {
            method: 'POST',
            ...(input && { body: input }),
          }
        ).then((res) => res.json()),
      enabled: false,
    })),
  });

  return { queries, inputs, setInputs };
}
