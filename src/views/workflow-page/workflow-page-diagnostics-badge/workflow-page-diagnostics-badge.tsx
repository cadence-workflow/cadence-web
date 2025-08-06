'use client';

import React from 'react';

import { Badge } from 'baseui/badge';
import { useParams } from 'next/navigation';

import useWorkflowDiagnosticsIssuesCount from '@/views/shared/hooks/use-workflow-diagnostics-issues-count';

import { type WorkflowPageTabsParams } from '../workflow-page-tabs/workflow-page-tabs.types';

import { overrides } from './workflow-page-diagnostics-badge.styles';

export default function WorkflowPageDiagnosticsBadge() {
  const { domain, cluster, workflowId, runId } =
    useParams<WorkflowPageTabsParams>();

  const issuesCount = useWorkflowDiagnosticsIssuesCount({
    domain,
    cluster,
    workflowId,
    runId,
  });

  if (issuesCount === undefined || issuesCount === 0) return null;

  return (
    <Badge
      content={issuesCount === 1 ? '1 issue' : `${issuesCount} issues`}
      overrides={overrides.badge}
    />
  );
}
