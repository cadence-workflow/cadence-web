'use client';
import React, { useContext } from 'react';

import { MarkdownContext } from '@/components/markdown/markdown-context-provider/markdown-context-provider';

import MarkdocWorkflowPayloadContent from './markdoc-workflow-payload-content';
import { MARKDOC_WORKFLOW_PAYLOAD_PLACEHOLDERS as PLACEHOLDERS } from './markdoc-workflow-payload.constants';
import { styled } from './markdoc-workflow-payload.styles';
import { type Props } from './markdoc-workflow-payload.types';

export default function MarkdocWorkflowPayload({
  kind,
  path,
  name,
  workflowId: workflowIdProp,
  runId: runIdProp,
  domain: domainProp,
  cluster: clusterProp,
}: Props) {
  const markdownContext = useContext(MarkdownContext);
  const domain = domainProp ?? markdownContext.domain;
  const cluster = clusterProp ?? markdownContext.cluster;
  const workflowId = workflowIdProp ?? markdownContext.workflowId;
  // Same rule as the signal button: the context run ID belongs to the context
  // workflow, so it is only inherited together with the workflow ID.
  const runId =
    workflowIdProp === undefined
      ? runIdProp ?? markdownContext.runId
      : runIdProp;

  if (!domain || !cluster || !workflowId) {
    return (
      <styled.Placeholder>{PLACEHOLDERS.missingContext}</styled.Placeholder>
    );
  }

  if (!runId) {
    return <styled.Placeholder>{PLACEHOLDERS.missingRunId}</styled.Placeholder>;
  }

  return (
    <MarkdocWorkflowPayloadContent
      kind={kind}
      path={path}
      name={name}
      domain={domain}
      cluster={cluster}
      workflowId={workflowId}
      runId={runId}
    />
  );
}
