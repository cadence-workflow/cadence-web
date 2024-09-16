import taskListWorkersTableConfig from '../config/task-list-workers-table.config';
import { type TaskListWorkerTableColumnID } from '../task-list-workers-table/task-list-workers-table.types';

export default function isValidTableColumn(
  column: string
): column is TaskListWorkerTableColumnID {
  return (
    taskListWorkersTableConfig.find((config) => config.id === column) !==
    undefined
  );
}
