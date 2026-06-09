'use client';
import { useInfiniteQuery } from '@tanstack/react-query';

import getListBatchActionsQueryOptions from './get-list-batch-actions-query-options';
import { type UseListBatchActionsParams } from './use-list-batch-actions.types';

export default function useListBatchActions(params: UseListBatchActionsParams) {
  return useInfiniteQuery(getListBatchActionsQueryOptions(params));
}
