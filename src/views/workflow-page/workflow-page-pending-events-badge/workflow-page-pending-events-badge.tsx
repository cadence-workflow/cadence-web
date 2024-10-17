'use client';
import React from 'react';

import { Badge } from 'baseui/badge';
import { useParams } from 'next/navigation';

import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import useDescribeWorkflow from '../hooks/use-describe-workflow';

import { overrides } from './workflow-page-pending-events-badge.styles';

export default function WorkflowPagePendingEventsBadge() {
  const params = useParams<WorkflowPageTabsParams>();
  const { workflowTab: _, ...restParams } = params;

  const { data: workflowDetails, isError } = useDescribeWorkflow({
    ...restParams,
  });

  if (isError) {
    return null;
  }

  const totalPending =
    (workflowDetails.pendingDecision ? 1 : 0) +
    workflowDetails.pendingActivities.length +
    workflowDetails.pendingChildren.length;

  if (totalPending === 0) {
    return null;
  }

  return (
    <Badge content={`${totalPending} pending`} overrides={overrides.badge} />
  );
}
