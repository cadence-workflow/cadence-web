'use client';
import { useContext, useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Button } from 'baseui/button';
import { useSnackbar } from 'baseui/snackbar';

import losslessJsonStringify from '@/utils/lossless-json-stringify';
import request from '@/utils/request';

import applyFieldValues from '../../helpers/apply-field-values';
import { MarkdownContext } from '../../markdown-context-provider/markdown-context-provider';

import { SIGNAL_SUCCESS_NOTIFICATION_DURATION_MS } from './signal-button.constants';
import { overrides } from './signal-button.styles';
import { type SignalButtonProps } from './signal-button.types';

export default function SignalButton({
  signalName,
  label,
  input,
  fields,
  workflowId: workflowIdProp,
  runId: runIdProp,
  domain: domainProp,
  cluster: clusterProp,
}: SignalButtonProps) {
  const markdownContext = useContext(MarkdownContext);
  const domain = domainProp ?? markdownContext.domain;
  const cluster = clusterProp ?? markdownContext.cluster;
  const workflowId = workflowIdProp ?? markdownContext.workflowId;
  // Only inherit runId from context when workflowId is also being inherited
  // from context -- an explicit workflowId with no explicit runId means
  // "the current run of that workflow" (per Cadence API semantics), not the
  // page's unrelated run.
  const runId =
    workflowIdProp === undefined
      ? runIdProp ?? markdownContext.runId
      : runIdProp;

  const { enqueue } = useSnackbar();

  const { fieldValues, fieldMeta } = markdownContext;
  const { input: resolvedInput, missingRequired } = useMemo(
    () => applyFieldValues(input, fields, fieldValues, fieldMeta),
    [input, fields, fieldValues, fieldMeta]
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!domain || !cluster || !workflowId) {
        throw new Error(
          'Missing workflow context. Please specify domain, cluster, and workflowId.'
        );
      }

      const signalInput =
        resolvedInput === undefined
          ? undefined
          : losslessJsonStringify(resolvedInput);

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
      markdownContext.onActionSuccess?.();
    },
    onError: (error: Error) => {
      enqueue({
        message: error.message || 'Failed to signal workflow',
        actionMessage: 'Dismiss',
      });
    },
  });

  const hasMissingFields = missingRequired.length > 0;
  const isDisabled = !domain || !cluster || !workflowId || hasMissingFields;

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
