'use client';
import { useState } from 'react';

import { Button } from 'baseui/button';
import { useSnackbar } from 'baseui/snackbar';
import { useRouter } from 'next/navigation';

import request from '@/utils/request';

export type StartWorkflowButtonProps = {
  workflowType: string;
  label: string;
  domain: string;
  cluster: string;
  taskList: string;
  wfId?: string;
  input?: Record<string, any>;
  timeoutSeconds?: number;
  sdkLanguage?: string;
};

export default function StartWorkflowButton({
  workflowType,
  label,
  domain,
  cluster,
  taskList,
  wfId,
  input,
  timeoutSeconds = 60,
  sdkLanguage = 'GO',
}: StartWorkflowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueue } = useSnackbar();
  const router = useRouter();

  const isDisabled = !domain || !cluster || !workflowType || !taskList;

  const handleClick = async () => {
    if (isLoading || isDisabled) {
      return;
    }

    if (!domain || !cluster || !workflowType || !taskList) {
      enqueue({
        message:
          'Missing required parameters. Please specify domain, cluster, workflowType, and taskList.',
        actionMessage: 'OK',
      });
      return;
    }

    setIsLoading(true);

    try {
      const workflowInput = input ? [input] : undefined;

      const response = await request(
        `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/start`,
        {
          method: 'POST',
          body: JSON.stringify({
            workflowType: { name: workflowType },
            taskList: { name: taskList },
            workflowId: wfId,
            workerSDKLanguage: sdkLanguage,
            input: workflowInput,
            executionStartToCloseTimeoutSeconds: timeoutSeconds,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        enqueue({
          message: errorData.message || 'Failed to start workflow',
          actionMessage: 'OK',
        });
        return;
      }

      const result = await response.json();
      const startedWorkflowId = result.workflowId || wfId;
      const runId = result.runId;

      enqueue({
        message: `Successfully started workflow "${workflowType}"`,
        actionMessage: 'View',
        actionOnClick: () => {
          if (startedWorkflowId && runId) {
            router.push(
              `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(startedWorkflowId)}/${encodeURIComponent(runId)}/summary`
            );
          }
        },
      });
    } catch (error: any) {
      enqueue({
        message: error.message || 'Failed to start workflow',
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
      overrides={{
        BaseButton: {
          style: {
            margin: '2px',
          },
        },
      }}
    >
      {label}
    </Button>
  );
}
