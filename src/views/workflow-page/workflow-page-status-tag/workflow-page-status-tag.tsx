'use client';
import React from 'react';

import pick from 'lodash/pick';
import { useParams } from 'next/navigation';

import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import getWorkflowStatusTagProps from '../helpers/get-workflow-status-tag-props';
import { useSuspenseDescribeWorkflow } from '../hooks/use-describe-workflow';
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

  const { data: workflowDetails, isError } = useSuspenseDescribeWorkflow({
    ...workflowDetailsParams,
  });

  if (isError) {
    return null;
  }

  const { closeEvent, isArchived } =
    workflowDetails.workflowExecutionInfo || {};

  return (
    <WorkflowStatusTag
      {...getWorkflowStatusTagProps(closeEvent, params, isArchived)}
    />
  );
}
