'use client';

import { useSnackbar } from 'baseui/snackbar';
import { useRouter } from 'next/navigation';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';

import {
  type ConfirmBatchActionHandler,
  type UseConfirmBatchActionParams,
} from './use-confirm-batch-action.types';
import useStartBatchAction from './use-start-batch-action';

export default function useConfirmBatchAction({
  domain,
  cluster,
  onSuccess,
}: UseConfirmBatchActionParams): {
  handleConfirm: ConfirmBatchActionHandler;
  isPending: boolean;
} {
  const { enqueue, dequeue } = useSnackbar();
  const router = useRouter();
  const { mutate: startBatchAction, isPending } = useStartBatchAction({
    cluster,
  });

  const handleConfirm: ConfirmBatchActionHandler = (input) => {
    startBatchAction(
      { domain, ...input },
      {
        onSuccess: (result) => {
          onSuccess?.();
          enqueue({
            message: 'Batch action started',
            startEnhancer: MdCheckCircle,
            actionMessage: 'View',
            actionOnClick: () => {
              dequeue();
              router.push(
                `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/batch-actions?bid=${encodeURIComponent(result.runId)}`
              );
            },
          });
        },
        onError: (err) => {
          enqueue({
            message: err.message || 'Failed to start batch action',
            startEnhancer: MdErrorOutline,
            actionMessage: 'OK',
            actionOnClick: () => dequeue(),
          });
        },
      }
    );
  };

  return { handleConfirm, isPending };
}
