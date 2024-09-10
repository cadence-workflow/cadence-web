import { type TaskListType } from '@/__generated__/proto-ts/uber/cadence/api/v1/TaskListType';

export type TaskListHandlerTypeOption = {
  id: TaskListType;
  label: string;
};

export type TaskListFiltersHandlersValue = {
  handlerType: TaskListType | undefined;
};
