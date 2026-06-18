import request from '@/utils/request';

import {
  type DescribeBatchActionQueryKey,
  type UseDescribeBatchActionQueryOptions,
  type UseQueryDescribeBatchActionParams,
} from './use-describe-batch-action.types';

export default function getDescribeBatchActionQueryOptions({
  domain,
  cluster,
  workflowId,
  runId,
  ...queryOptions
}: UseQueryDescribeBatchActionParams): UseDescribeBatchActionQueryOptions {
  return {
    queryKey: [
      'describeBatchAction',
      { domain, cluster, workflowId, runId },
    ] as DescribeBatchActionQueryKey,
    queryFn: ({
      queryKey: [_, p],
    }: {
      queryKey: DescribeBatchActionQueryKey;
    }) =>
      request(
        `/api/domains/${encodeURIComponent(p.domain)}/${encodeURIComponent(
          p.cluster
        )}/batch-actions/${encodeURIComponent(p.workflowId)}/runs/${encodeURIComponent(p.runId)}`
      ).then((res) => res.json()),
    ...queryOptions,
  };
}
