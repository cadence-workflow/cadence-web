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
  const noMissingData = Boolean(domain && cluster && workflowId && runId);

  const href = noMissingData
    ? `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}/${encodeURIComponent(runId)}`
    : '';
  return (
    <Link href={href} style={{ fontWeight: 'inherit' }}>
      {runId}
    </Link>
  );
}
