import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';

export type UseDescribeTaskListParams = {
  domain: string;
  cluster: string;
  taskListName: string;
};

export type TaskListValidationResult = {
  data: DescribeTaskListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};
