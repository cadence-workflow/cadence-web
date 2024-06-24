'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { pick } from 'lodash';
import { useParams } from 'next/navigation';

import request from '@/utils/request';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import getWorkflowStatusTagProps from '../helpers/get-workflow-status-tag-props';
import type { WorkflowPageParams } from '../workflow-page.types';

export default function WorkflowPageStatusTag() {
  const params = useParams<WorkflowPageParams>();
  const {
    data: workflowHistory,
    isError,
    isLoading,
  } = useSuspenseQuery({
    queryKey: [
      'workflow_history',
      pick(params, 'cluster', 'workflowId', 'runId', 'domain'),
    ] as const,
    queryFn: ({ queryKey: [_, qp] }) =>
      request(
        `/api/domains/${qp.domain}/${qp.cluster}/workflows/${qp.workflowId}/${qp.runId}/history`
      ).then((res) => res.json()),
  });

  if (isError || isLoading) return null;
  const lastEvent = workflowHistory?.history?.events?.slice(-1)[0];

  return (
    <WorkflowStatusTag {...getWorkflowStatusTagProps(lastEvent, params)} />
  );
}
