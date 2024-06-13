'use client';
import React from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import request from '@/utils/request';
import WorkflowStatusTag from '@/views/shared/workflow-status-tag/workflow-status-tag';

import type { WorkflowPageParams } from '../workflow-page.types';

export default function WorkflowPageStatusTag() {
  const params = useParams<WorkflowPageParams>();
  const { data, isError, isLoading } = useSuspenseQuery({
    queryKey: ['workflow_execution'],
    queryFn: () =>
      request(
        `/api/domains/${params.domain}/${params.cluster}/workflows/${params.workflowId}/${params.runId}`
      ).then((res) => res.json()),
  });
  if (isError || isLoading) return null;

  return (
    <WorkflowStatusTag
      status={
        data?.workflowExecutionInfo?.closeStatus ||
        'WORKFLOW_EXECUTION_STATUS_RUNNING'
      }
    />
  );
}
