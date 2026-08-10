import { type Control } from 'react-hook-form';

export type TaskListFieldValues = {
  taskList: { name: string };
};

export type UseTaskListFieldValidationParams<
  TFieldValues extends TaskListFieldValues = TaskListFieldValues,
> = {
  control: Control<TFieldValues>;
  domain: string;
  cluster: string;
};

export type UseTaskListFieldValidationResult = {
  isTaskListLoading: boolean;
  taskListCaptionMessage: string | null;
};
