import { type TaskList } from '@/route-handlers/describe-task-list/describe-task-list.types';

import type taskListWorkersTableConfig from '../config/task-list-workers-table.config';

export type TaskListWorkerTableColumnID =
  (typeof taskListWorkersTableConfig)[number]['id'];

export type Props = { taskList: TaskList };
