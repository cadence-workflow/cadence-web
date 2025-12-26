'use client';

import { useState } from 'react';
import { useSnackbar } from 'baseui/snackbar';
import { MdCheckCircle } from 'react-icons/md';

import Button from '@/components/button/button';
import request from '@/utils/request/request';
import { RequestError } from '@/utils/request/request-error';

import type { MDXStartProps } from './mdx-start.types';

export default function MDXStart({
  domain,
  cluster = 'cluster0',
  'workflow-type': workflowType,
  'task-list': taskList,
  'wf-id': workflowId,
  input,
  'timeout-seconds': timeoutSeconds = 3600,
  children,
}: MDXStartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueue, dequeue } = useSnackbar();

  const handleStart = async () => {
    setIsLoading(true);

    try {
      const response = await request(
        `/api/domains/${domain}/${cluster}/workflows/start`,
        {
          method: 'POST',
          body: JSON.stringify({
            workflowType: {
              name: workflowType,
            },
            taskList: {
              name: taskList,
            },
            workflowId,
            workerSDKLanguage: 'GO', // Default to Go
            input: input || [],
            executionStartToCloseTimeoutSeconds: timeoutSeconds,
          }),
        }
      );

      const result = await response.json();

      enqueue({
        message: `Successfully started workflow "${workflowType}" with ID ${result.workflowId}`,
        startEnhancer: MdCheckCircle,
        actionMessage: 'OK',
        actionOnClick: () => dequeue(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof RequestError
          ? error.message
          : 'Failed to start workflow';

      enqueue({
        message: errorMessage,
        actionMessage: 'Dismiss',
        actionOnClick: () => dequeue(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStart}
      isLoading={isLoading}
      disabled={isLoading}
      size="compact"
      kind="primary"
    >
      {children}
    </Button>
  );
}

