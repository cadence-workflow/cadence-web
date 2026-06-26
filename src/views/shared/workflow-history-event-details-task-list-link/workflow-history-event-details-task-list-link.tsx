'use client';
import React from 'react';

import Link from '@/components/link/link';

import { type Props } from './workflow-history-event-details-task-list-link.types';

export default function WorkflowHistoryEventDetailsTaskListLink({
  cluster,
  domain,
  taskList,
}: Props) {
  if (!taskList?.name) return null;
  if (taskList.kind === 'STICKY' || !cluster || !domain) return taskList.name;
  return (
    <Link
      href={`/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/task-lists/${encodeURIComponent(taskList.name)}`}
      style={{ fontWeight: 'inherit' }}
    >
      {taskList?.name}
    </Link>
  );
}
