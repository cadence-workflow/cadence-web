'use client';
import { useContext } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { useSnackbar } from 'baseui/snackbar';

import losslessJsonStringify from '@/utils/lossless-json-stringify';
import request from '@/utils/request';

import { MarkdownPageContext } from '../../markdown-page-context';

import { SIGNAL_SUCCESS_NOTIFICATION_DURATION_MS } from './signal-button.constants';
import { overrides } from './signal-button.styles';
import { type SignalButtonProps } from './signal-button.types';

export default function SignalButton({
  signalName,
  label,
  input,
  workflowId: workflowIdProp,
  runId: runIdProp,
  domain: domainProp,
  cluster: clusterProp,
}: SignalButtonProps) {
  const pageContext = useContext(MarkdownPageContext);
  const domain = domainProp ?? pageContext.domain;
  const cluster = clusterProp ?? pageContext.cluster;
  const workflowId = workflowIdProp ?? pageContext.workflowId;
  // Only inherit runId from context when workflowId is also being inherited
  // from context -- an explicit workflowId with no explicit runId means
  // "the current run of that workflow" (per Cadence API semantics), not the
  // page's unrelated run.
  const runId =
    workflowIdProp === undefined ? runIdProp ?? pageContext.runId : runIdProp;

  const { enqueue } = useSnackbar();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!domain || !cluster || !workflowId) {
        throw new Error(
          'Missing workflow context. Please specify domain, cluster, and workflowId.'
        );
      }

      const signalInput =
        input === undefined ? undefined : losslessJsonStringify(input);

      const runIdPathSegment = runId ? `/${encodeURIComponent(runId)}` : '';

      const response = await request(
        `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}${runIdPathSegment}/signal`,
        {
          method: 'POST',
          body: JSON.stringify({
            signalName,
            signalInput,
          }),
        }
      );

      return response.json();
    },
    onSuccess: () => {
      enqueue(
        {
          message: `Successfully sent signal "${signalName}"`,
          actionMessage: 'OK',
        },
        SIGNAL_SUCCESS_NOTIFICATION_DURATION_MS
      );
    },
    onError: (error: Error) => {
      enqueue({
        message: error.message || 'Failed to signal workflow',
        actionMessage: 'Dismiss',
      });
    },
  });

  const isDisabled = !domain || !cluster || !workflowId;

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
