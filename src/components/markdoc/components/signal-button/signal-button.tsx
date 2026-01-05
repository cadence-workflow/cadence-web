'use client';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { useSnackbar } from 'baseui/snackbar';

import losslessJsonStringify from '@/utils/lossless-json-stringify';
import request from '@/utils/request';

import { overrides } from './signal-button.styles';
import { type SignalButtonProps } from './signal-button.types';

export default function SignalButton({
  signalName,
  label,
  input,
  workflowId,
  runId,
  domain,
  cluster,
}: SignalButtonProps) {
  const { enqueue } = useSnackbar();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!domain || !cluster || !workflowId || !runId) {
        throw new Error(
          'Missing workflow context. Please specify domain, cluster, workflowId, and runId.'
        );
      }

      const signalInput =
        input === undefined ? undefined : losslessJsonStringify(input);

      const response = await request(
        `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}/${encodeURIComponent(runId)}/signal`,
        {
          method: 'POST',
          body: JSON.stringify({
            signalName,
            signalInput,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? 'Failed to signal workflow');
      }

      return response.json();
    },
    onSuccess: () => {
      enqueue({
        message: `Successfully sent signal "${signalName}"`,
        actionMessage: 'OK',
      });
    },
    onError: (error: Error) => {
      enqueue({
        message: error.message || 'Failed to signal workflow',
        actionMessage: 'Dismiss',
      });
    },
  });

  const isDisabled = !domain || !cluster || !workflowId || !runId;

  const handleClick = () => {
    if (!isDisabled) {
      mutate();
    }
  };

  return (
    <Button
      disabled={isPending || isDisabled}
      onClick={handleClick}
      isLoading={isPending}
      overrides={overrides}
    >
      {label}
    </Button>
  );
}
