'use client';

import React from 'react';

import { Button } from 'baseui/button';
import Link from 'next/link';
import { RiStethoscopeLine } from 'react-icons/ri';

import useWorkflowDiagnosticsIssuesCount from '@/views/shared/hooks/use-workflow-diagnostics-issues-count';

import { styled } from './workflow-summary-diagnostics-banner.styles';
import { type Props } from './workflow-summary-diagnostics-banner.types';

export default function WorkflowSummaryDiagnosticsBanner({
  domain,
  cluster,
  workflowId,
  runId,
}: Props) {
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
        href={`/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}/diagnostics`}
      >
        {`View ${issuesCount === 1 ? 'issue' : 'issues'}`}
      </Button>
    </styled.Banner>
  );
}
