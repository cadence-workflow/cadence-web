'use client';
import React from 'react';

import { StyledLink } from 'baseui/link';
import Link from 'next/link';

import { type Props } from './workflow-summary-tab-details-wf-execution-link.types';

export default function WorkflowSummaryTabDetailsExecutionLink({
  runId,
  workflowId,
  cluster,
  domain,
}: Props) {
  return (
    <StyledLink
      $as={Link}
      href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}/${encodeURIComponent(runId)}`}
      style={{ fontWeight: 'inherit' }}
    >
      {runId}
    </StyledLink>
  );
}
