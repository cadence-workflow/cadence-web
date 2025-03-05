'use client';
import React from 'react';

import Link from '@/components/link/link';

import { type Props } from './workflow-history-event-details-wf-execution-link.types';

export default function WorkflowHistoryEventDetailsExecutionLink({
  runId,
  workflowId,
  cluster,
  domain,
}: Props) {
  const linkText = runId || workflowId;
  if (!linkText) return null;

  let href = '';
  if (domain && cluster && workflowId) {
    href = runId
      ? `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}/${encodeURIComponent(runId)}`
      : // TODO: @assem.hafez make query params type safe
        `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows?search=${encodeURIComponent(workflowId)}`;
  }

  return (
    <Link href={href} style={{ fontWeight: 'inherit' }}>
      {linkText}
    </Link>
  );
}
