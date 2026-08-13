'use client';
import { useQuery } from '@tanstack/react-query';

import { type RequestError } from '@/utils/request/request-error';
import { type BatchAction } from '@/views/domain-batch-actions/domain-batch-actions.types';

import getDescribeBatchActionQueryOptions from './get-describe-batch-action-query-options';
import {
  type DescribeBatchActionQueryKey,
  type UseQueryDescribeBatchActionParams,
} from './use-describe-batch-action.types';

export default function useDescribeBatchAction(
  params: UseQueryDescribeBatchActionParams
) {
  return useQuery<
    BatchAction,
    RequestError,
    BatchAction,
    DescribeBatchActionQueryKey
  >(getDescribeBatchActionQueryOptions(params));
}
