'use client';

import TaskListWorkersBadge from '@/views/shared/task-list-workers-badge/task-list-workers-badge';

import { styled } from './task-list-label.styles';
import { type Props } from './task-list-label.types';

export default function TaskListLabel(props: Props) {
  return (
    <styled.LabelContainer $isHighlighted={props.isHighlighted}>
      {props.taskList.name}
      <TaskListWorkersBadge
        variant="workers"
        count={props.taskList.workers.length}
      />
    </styled.LabelContainer>
  );
}
