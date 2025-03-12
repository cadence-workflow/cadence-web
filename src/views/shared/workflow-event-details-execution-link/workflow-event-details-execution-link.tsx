'use client';
import React from 'react';

import queryString from 'query-string';

import Link from '@/components/link/link';

import { type Props } from './workflow-event-details-execution-link.types';

export default function WorkflowEventDetailsExecutionLink({
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
        // NOTE: workflowId is passed to both search and workflowId to support basic/advanced/visibility
        `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows?${queryString.stringify({ search: workflowId, workflowId })}`;
  }

  return (
    <Link href={href} style={{ fontWeight: 'inherit' }}>
      {linkText}
    </Link>
  );
}
