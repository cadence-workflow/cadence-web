import { type TaskList } from '@/route-handlers/describe-task-list/describe-task-list.types';

export type Props = {
  domain: string;
  cluster: string;
  taskList: TaskList;
};
