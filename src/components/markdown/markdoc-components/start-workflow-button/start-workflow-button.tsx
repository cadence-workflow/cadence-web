'use client';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { useSnackbar } from 'baseui/snackbar';
import { useRouter } from 'next/navigation';

import request from '@/utils/request';

import { overrides } from './start-workflow-button.styles';
import { type StartWorkflowButtonProps } from './start-workflow-button.types';

type StartWorkflowResult = {
  workflowId?: string;
  runId?: string;
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
  const { enqueue } = useSnackbar();
  const router = useRouter();

  const { mutate, isPending } = useMutation<StartWorkflowResult>({
    mutationFn: async () => {
      if (!domain || !cluster || !workflowType || !taskList) {
        throw new Error(
          'Missing required parameters. Please specify domain, cluster, workflowType, and taskList.'
        );
      }

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

      return response.json();
    },
    onSuccess: (result) => {
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
    },
    onError: (error: Error) => {
      enqueue({
        message: error.message || 'Failed to start workflow',
        actionMessage: 'Dismiss',
      });
    },
  });

  const isDisabled = !domain || !cluster || !workflowType || !taskList;

  const handleClick = () => {
    if (!isDisabled) {
      mutate();
    }
  };

  return (
    <Button
      disabled={isDisabled}
      onClick={handleClick}
      isLoading={isPending}
      overrides={overrides.button}
    >
      {label}
    </Button>
  );
}
