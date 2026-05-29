import request from '@/utils/request';
import DOMAIN_BATCH_ACTION_STATUS_REFETCH_INTERVAL from '@/views/domain-batch-actions/config/domain-batch-action-status-refetch-interval.config';
import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

import {
  type DescribeBatchActionQueryKey,
  type UseDescribeBatchActionParams,
  type UseDescribeBatchActionQueryOptions,
} from './use-describe-batch-action.types';

export default function getDescribeBatchActionQueryOptions({
  domain,
  cluster,
  batchActionId,
  refetchInterval = DOMAIN_BATCH_ACTION_STATUS_REFETCH_INTERVAL,
  ...queryOptions
}: UseDescribeBatchActionParams): UseDescribeBatchActionQueryOptions {
  return {
    queryKey: [
      'describeBatchAction',
      { domain, cluster, batchActionId },
    ] as DescribeBatchActionQueryKey,
    queryFn: ({
      queryKey: [_, p],
    }: {
      queryKey: DescribeBatchActionQueryKey;
    }) =>
      request(
        `/api/domains/${encodeURIComponent(p.domain)}/${encodeURIComponent(
          p.cluster
        )}/batch-actions/${encodeURIComponent(p.batchActionId)}`
      ).then((res) => res.json()),
    refetchInterval: (query: { state: { data?: BatchAction } }) =>
      query.state.data?.status === 'RUNNING' ? refetchInterval : false,
    ...queryOptions,
  };
}
