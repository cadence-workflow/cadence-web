'use client';
import React from 'react';

import pick from 'lodash/pick';
import { useParams } from 'next/navigation';

import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import getWorkflowStatusTagProps from '../helpers/get-workflow-status-tag-props';
import useDescribeWorkflow from '../hooks/use-describe-workflow';
import type { WorkflowPageParams } from '../workflow-page.types';

export default function WorkflowPageStatusTag() {
  const params = useParams<WorkflowPageParams>();
  const workflowDetailsParams = pick(
    params,
    'cluster',
    'workflowId',
    'runId',
    'domain'
  );

  const { data: workflowDetails, isError } = useDescribeWorkflow({
    ...workflowDetailsParams,
  });

  if (isError) {
    return null;
  }

  const closeEvent = workflowDetails.workflowExecutionInfo?.closeEvent;

  return (
    <WorkflowStatusTag {...getWorkflowStatusTagProps(closeEvent, params)} />
  );
}
