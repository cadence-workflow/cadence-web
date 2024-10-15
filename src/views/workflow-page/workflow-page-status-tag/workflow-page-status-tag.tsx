'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import pick from 'lodash/pick';
import { useParams } from 'next/navigation';

import { type DescribeWorkflowResponse } from '@/route-handlers/describe-workflow/describe-workflow.types';
import request from '@/utils/request';
import { type RequestError } from '@/utils/request/request-error';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import WORKFLOW_PAGE_STATUS_REFRESH_INTERVAL from '../config/workflow-page-status-refresh-interval.config';
import getWorkflowStatusTagProps from '../helpers/get-workflow-status-tag-props';
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
  const {
    data: workflowDetails,
    isError,
    isLoading,
  } = useSuspenseQuery<
    DescribeWorkflowResponse,
    RequestError,
    DescribeWorkflowResponse,
    [string, typeof workflowDetailsParams]
  >({
    queryKey: ['describe_workflow', workflowDetailsParams] as const,
    queryFn: ({ queryKey: [_, p] }) =>
      request(
        `/api/domains/${p.domain}/${p.cluster}/workflows/${p.workflowId}/${p.runId}`
      ).then((res) => res.json()),
    refetchInterval: (query) => {
      const { closeStatus } = query.state.data?.workflowExecutionInfo || {};
      if (
        !closeStatus ||
        closeStatus === 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
      )
        return WORKFLOW_PAGE_STATUS_REFRESH_INTERVAL;

      return false;
    },
  });

  if (isError || isLoading) return null;
  const closeEvent = workflowDetails.workflowExecutionInfo?.closeEvent;

  return (
    <WorkflowStatusTag {...getWorkflowStatusTagProps(closeEvent, params)} />
  );
}
