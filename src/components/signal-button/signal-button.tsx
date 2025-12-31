'use client';
import { useState } from 'react';

import { Button } from 'baseui/button';
import { useSnackbar } from 'baseui/snackbar';

import losslessJsonStringify from '@/utils/lossless-json-stringify';
import request from '@/utils/request';

export type SignalButtonProps = {
  signalName: string;
  label: string;
  signalValue?: Record<string, any>;
  domain?: string;
  cluster?: string;
  workflowId?: string;
  runId?: string;
  contextWorkflowId?: string;
  contextRunId?: string;
};

export default function SignalButton({
  signalName,
  label,
  signalValue,
  workflowId,
  runId,
  domain,
  cluster,
  contextWorkflowId,
  contextRunId,
}: SignalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueue } = useSnackbar();

  const targetDomain = domain;
  const targetCluster = cluster;
  const targetWorkflowId = workflowId || contextWorkflowId;
  const targetRunId = runId || contextRunId;

  const isDisabled =
    !targetDomain || !targetCluster || !targetWorkflowId || !targetRunId;

  const handleClick = async () => {
    if (isLoading || isDisabled) {
      return; // Prevent double clicks or invalid requests
    }

    if (!targetDomain || !targetCluster || !targetWorkflowId || !targetRunId) {
      enqueue({
        message:
          'Missing workflow context. Please specify domain, cluster, workflowId, and runId.',
        actionMessage: 'OK',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('signalValue', signalValue);
      const signalInput = signalValue == undefined ? undefined : losslessJsonStringify(signalValue);

      const response = await request(
        `/api/domains/${encodeURIComponent(targetDomain)}/${encodeURIComponent(targetCluster)}/workflows/${encodeURIComponent(targetWorkflowId)}/${encodeURIComponent(targetRunId)}/signal`,
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
        enqueue({
          message: errorData.message || 'Failed to signal workflow',
          actionMessage: 'OK',
        });
        return;
      }

      enqueue({
        message: `Successfully sent signal "${signalName}"`,
        actionMessage: 'OK',
      });
    } catch (error: any) {
      enqueue({
        message: error.message || 'Failed to signal workflow',
        actionMessage: 'Dismiss',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading || isDisabled}
      onClick={handleClick}
      isLoading={isLoading}
    >
      {label}
    </Button>
  );
}
