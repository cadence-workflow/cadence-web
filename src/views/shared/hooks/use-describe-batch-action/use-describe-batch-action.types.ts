import { type UseQueryOptions } from '@tanstack/react-query';

import { type RouteParams } from '@/route-handlers/describe-batch-action/describe-batch-action.types';
import { type RequestError } from '@/utils/request/request-error';
import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

export type UseDescribeBatchActionParams = RouteParams & {
  refetchInterval?: number;
};

export type DescribeBatchActionQueryKey = [
  'describeBatchAction',
  Omit<UseDescribeBatchActionParams, 'refetchInterval'>,
];

export type UseDescribeBatchActionQueryOptions = UseQueryOptions<
  BatchAction,
  RequestError,
  BatchAction,
  DescribeBatchActionQueryKey
>;

export type UseQueryDescribeBatchActionParams = UseDescribeBatchActionParams &
  Partial<
    UseQueryOptions<
      BatchAction,
      RequestError,
      BatchAction,
      DescribeBatchActionQueryKey
    >
  >;
