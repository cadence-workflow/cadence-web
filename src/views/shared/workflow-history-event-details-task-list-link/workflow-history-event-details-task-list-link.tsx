'use client';

import React from 'react';

import Link from '@/components/link/link';
import useDescribeTaskList from '@/views/shared/hooks/use-describe-task-list/use-describe-task-list';
import TaskListWorkersBadge from '@/views/shared/task-list-workers-badge/task-list-workers-badge';

import { styled } from './workflow-history-event-details-task-list-link.styles';
import { type Props } from './workflow-history-event-details-task-list-link.types';

export default function WorkflowHistoryEventDetailsTaskListLink({
  cluster,
  domain,
  taskList,
}: Props) {
  const taskListName = taskList?.name ?? '';
  const isSticky = taskList?.kind === 'STICKY';
  const shouldFetch = Boolean(taskListName && !isSticky && cluster && domain);

  const { data, isLoading, isError } = useDescribeTaskList({
    domain,
    cluster,
    taskListName: shouldFetch ? taskListName : '',
  });

  if (!taskListName) return null;

  const name =
    isSticky || !cluster || !domain ? (
      taskListName
    ) : (
      <Link
        href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/task-lists/${encodeURIComponent(taskListName)}`}
        style={{ fontWeight: 'inherit' }}
      >
        {taskListName}
      </Link>
    );

  const workersBadge =
    shouldFetch && !isError ? (
      <TaskListWorkersBadge
        variant="workers"
        count={data?.taskList.workers.length}
        isLoading={isLoading || !data}
      />
    ) : null;

  return (
    <styled.Container>
      {name}
      {isSticky ? <TaskListWorkersBadge variant="sticky" /> : workersBadge}
    </styled.Container>
  );
}
