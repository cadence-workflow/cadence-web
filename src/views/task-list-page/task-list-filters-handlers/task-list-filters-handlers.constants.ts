import { type TaskListHandlerTypeOption } from './task-list-filters-handlers.types';

export const TASK_LIST_HANDLERS_OPTIONS = [
  { id: 'TASK_LIST_TYPE_ACTIVITY', label: 'Activity' },
  { id: 'TASK_LIST_TYPE_DECISION', label: 'Decision' },
] as const satisfies Array<TaskListHandlerTypeOption>;
