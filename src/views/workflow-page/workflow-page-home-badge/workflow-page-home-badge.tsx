'use client';

import React from 'react';

import { Badge } from 'baseui/badge';
import { useParams } from 'next/navigation';

import decodeUrlParams from '@/utils/decode-url-params';
import useWorkflowHomeBadge from '@/views/workflow-home/hooks/use-workflow-home-badge';

import { type WorkflowPageTabsParams } from '../workflow-page-tabs/workflow-page-tabs.types';

import { overrides, styled } from './workflow-page-home-badge.styles';

export default function WorkflowPageHomeBadge() {
  const params = useParams<WorkflowPageTabsParams>();
  const { domain, cluster, workflowId, runId } = decodeUrlParams(
    params
  ) as WorkflowPageTabsParams;

  const homeBadge = useWorkflowHomeBadge({
    domain,
    cluster,
    workflowId,
    runId,
  });

  if (!homeBadge) return null;

  return (
    <Badge
      content={<styled.Text title={homeBadge}>{homeBadge}</styled.Text>}
      overrides={overrides.badge}
    />
  );
}
