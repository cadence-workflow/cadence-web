'use client';

import { useEffect, useRef, useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DURATION, useSnackbar } from 'baseui/snackbar';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

import { BATCH_ACTION_BATCHER_DOMAIN } from '@/route-handlers/list-batch-actions/list-batch-actions.constants';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { BATCH_ACTION_LIST_INVALIDATE_TIMEOUT_MS } from '../domain-batch-actions.constants';
import { overrides } from '../domain-batch-actions.styles';

import {
  type UseTerminateBatchActionParams,
  type UseTerminateBatchActionResult,
} from './use-terminate-batch-action.types';

export default function useTerminateBatchAction({
  cluster,
  workflowId,
  onSuccess,
}: UseTerminateBatchActionParams): UseTerminateBatchActionResult {
  const { enqueue, dequeue } = useSnackbar();
  const queryClient = useQueryClient();
  // Keep the loading state up through the post-success invalidate delay so the
  // button doesn't flip back to idle before the list refreshes.
  const [isSettling, setIsSettling] = useState(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  const { mutate, isPending } = useMutation<unknown, RequestError, string>({
    mutationFn: (runId: string) =>
      // The batcher workflow lives in the batcher domain, not the user's
      // domain, so we terminate it directly there.
      request(
        `/api/domains/${encodeURIComponent(
          BATCH_ACTION_BATCHER_DOMAIN
        )}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(
          workflowId
        )}/${encodeURIComponent(runId)}/terminate`,
        { method: 'POST', body: JSON.stringify({}) }
      ),
    onSuccess: () => {
      onSuccess?.();
      enqueue(
        {
          message: 'Batch action aborted',
          startEnhancer: MdCheckCircle,
        },
        DURATION.short
      );
      // Give the batcher visibility a moment to reflect the termination before
      // refreshing the list.
      setIsSettling(true);
      settleTimer.current = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['listBatchActions'] });
        setIsSettling(false);
      }, BATCH_ACTION_LIST_INVALIDATE_TIMEOUT_MS);
    },
    onError: (err) => {
      enqueue(
        {
          message: err.message || 'Failed to abort batch action',
          startEnhancer: MdErrorOutline,
          overrides: overrides.errorSnackbar,
          actionMessage: 'OK',
          actionOnClick: () => dequeue(),
        },
        DURATION.short
      );
    },
  });

  return {
    terminate: (runId: string) => mutate(runId),
    isTerminating: isPending || isSettling,
  };
}
