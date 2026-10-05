'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DURATION, useSnackbar } from 'baseui/snackbar';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

import { BATCH_ACTION_BATCHER_DOMAIN } from '@/route-handlers/list-batch-actions/list-batch-actions.constants';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';

import { BATCH_ACTION_TUNE_SIGNAL_NAME } from '../domain-batch-actions.constants';
import { overrides } from '../domain-batch-actions.styles';

import {
  type EditBatchActionRpsInput,
  type UseEditBatchActionRpsParams,
  type UseEditBatchActionRpsResult,
} from './use-edit-batch-action-rps.types';

export default function useEditBatchActionRps({
  domain,
  cluster,
  workflowId,
  runId,
  onSuccess,
}: UseEditBatchActionRpsParams): UseEditBatchActionRpsResult {
  const { enqueue, dequeue } = useSnackbar();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    unknown,
    RequestError,
    EditBatchActionRpsInput
  >({
    mutationFn: ({ rps }) =>
      // The batcher workflow lives in the batcher domain, not the user's
      // domain, so we target it directly via the generic signal endpoint.
      request(
        `/api/domains/${encodeURIComponent(
          BATCH_ACTION_BATCHER_DOMAIN
        )}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(
          workflowId
        )}/${encodeURIComponent(runId)}/signal`,
        {
          method: 'POST',
          body: JSON.stringify({
            signalName: BATCH_ACTION_TUNE_SIGNAL_NAME,
            signalInput: JSON.stringify({ RPS: rps }),
          }),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          'describeBatchAction',
          { domain, cluster, workflowId, runId },
        ],
      });
      onSuccess?.();
      enqueue(
        {
          message: 'RPS updated',
          startEnhancer: MdCheckCircle,
        },
        DURATION.short
      );
    },
    onError: (err) => {
      enqueue(
        {
          message: err.message || 'Failed to update RPS',
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
    editRps: (rps: number) => mutate({ rps }),
    isPending,
  };
}
