'use client';

import { useState } from 'react';
import { useSnackbar } from 'baseui/snackbar';
import { MdCheckCircle } from 'react-icons/md';

import Button from '@/components/button/button';
import losslessJsonStringify from '@/utils/lossless-json-stringify';
import request from '@/utils/request/request';
import { RequestError } from '@/utils/request/request-error';

import type { MDXSignalProps } from './mdx-signal.types';

export default function MDXSignal({
  domain,
  cluster,
  'wf-id': workflowId,
  'run-id': runId,
  name,
  input,
  children,
}: MDXSignalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueue, dequeue } = useSnackbar();

  const handleSignal = async () => {
    setIsLoading(true);

    try {
      // Convert input object to JSON string if provided
      const signalInput = input !== undefined ? losslessJsonStringify(input) : undefined;

      const uri = `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster!)}/workflows/${encodeURIComponent(workflowId)}/${encodeURIComponent(runId)}/signal`;

      const response = await request(
        uri,
        {
          method: 'POST',
          body: JSON.stringify({ signalName: name, signalInput }),
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
        message: `Successfully sent signal "${name}" to workflow ${workflowId}`,
        startEnhancer: MdCheckCircle,
        actionMessage: 'OK',
        actionOnClick: () => dequeue(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof RequestError
          ? error.message
          : 'Failed to signal workflow';

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
      onClick={handleSignal}
      isLoading={isLoading}
      disabled={isLoading}
      size="compact"
      kind="primary"
    >
      {children}
    </Button>
  );
}

