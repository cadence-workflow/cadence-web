'use client';

import React from 'react';

import { Button } from 'baseui/button';
import Link from 'next/link';
import { RiStethoscopeLine } from 'react-icons/ri';

import useConfigValue from '@/hooks/use-config-value/use-config-value';
import useWorkflowDiagnosticsIssuesCount from '@/views/shared/hooks/use-workflow-diagnostics-issues-count';

import { styled } from './workflow-summary-diagnostics-banner.styles';
import { type Props } from './workflow-summary-diagnostics-banner.types';

export default function WorkflowSummaryDiagnosticsBanner({
  domain,
  cluster,
  workflowId,
  runId,
}: Props) {
  // TODO: delete this once the old Workflow Diagnostics view has been deleted
  const { data: isWorkflowDiagnosticsInHistoryEnabled } = useConfigValue(
    'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'
  );

  const issuesCount = useWorkflowDiagnosticsIssuesCount({
    domain,
    cluster,
    workflowId,
    runId,
  });

  if (issuesCount === undefined || issuesCount === 0) return null;

  return (
    <styled.Banner>
      <styled.BannerTextContainer>
        <RiStethoscopeLine size="20px" />
        {`${
          issuesCount === 1 ? '1 issue was' : `${issuesCount} issues were`
        } detected on this workflow`}
      </styled.BannerTextContainer>
      <Button
        size="mini"
        $as={Link}
        href={`/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/${isWorkflowDiagnosticsInHistoryEnabled ? 'history' : 'diagnostics'}`}
      >
        {isWorkflowDiagnosticsInHistoryEnabled
          ? 'View in History'
          : `View ${issuesCount === 1 ? 'issue' : 'issues'}`}
      </Button>
    </styled.Banner>
  );
}
