import { type TaskList } from '@/route-handlers/describe-task-list/describe-task-list.types';

export type Props = {
  taskList: TaskList;
  isHighlighted?: boolean;
};
