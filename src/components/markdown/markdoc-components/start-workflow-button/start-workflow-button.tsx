'use client';
import { useContext, useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { useSnackbar } from 'baseui/snackbar';
import { useRouter } from 'next/navigation';

import request from '@/utils/request';

import applyFieldValues from '../../helpers/apply-field-values';
import { MarkdownContext } from '../../markdown-context-provider/markdown-context-provider';

import { overrides } from './start-workflow-button.styles';
import { type StartWorkflowButtonProps } from './start-workflow-button.types';

type StartWorkflowResult = {
  workflowId?: string;
  runId?: string;
};

export default function StartWorkflowButton({
  workflowType,
  label,
  domain: domainProp,
  cluster: clusterProp,
  taskList,
  wfId,
  input,
  fields,
  memo,
  timeoutSeconds = 60,
  sdkLanguage = 'GO',
}: StartWorkflowButtonProps) {
  const markdownContext = useContext(MarkdownContext);
  const domain = domainProp ?? markdownContext.domain;
  const cluster = clusterProp ?? markdownContext.cluster;

  const { enqueue } = useSnackbar();

  const { fieldValues, fieldMeta } = markdownContext;
  const { input: resolvedInput, missingRequired } = useMemo(
    () => applyFieldValues(input, fields, fieldValues, fieldMeta),
    [input, fields, fieldValues, fieldMeta]
  );
  const router = useRouter();

  const { mutate, isPending } = useMutation<StartWorkflowResult>({
    mutationFn: async () => {
      if (!domain || !cluster || !workflowType || !taskList) {
        throw new Error(
          'Missing required parameters. Please specify domain, cluster, workflowType, and taskList.'
        );
      }

      const workflowInput = resolvedInput ? [resolvedInput] : undefined;

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
            memo,
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
          if (domain && cluster && startedWorkflowId && runId) {
            router.push(
              `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(startedWorkflowId)}/${encodeURIComponent(runId)}/summary`
            );
          }
        },
      });
      markdownContext.onActionSuccess?.();
    },
    onError: (error: Error) => {
      enqueue({
        message: error.message || 'Failed to start workflow',
        actionMessage: 'Dismiss',
      });
    },
  });

  const hasMissingFields = missingRequired.length > 0;
  const isDisabled =
    !domain || !cluster || !workflowType || !taskList || hasMissingFields;

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
      title={
        hasMissingFields
          ? `Fill in required fields: ${missingRequired.join(', ')}`
          : undefined
      }
      overrides={overrides.button}
    >
      {label}
    </Button>
  );
}
