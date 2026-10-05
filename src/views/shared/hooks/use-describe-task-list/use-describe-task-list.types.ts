import { type UseQueryOptions } from '@tanstack/react-query';

import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';

type DescribeTaskListQueryParams = {
  domain: string;
  cluster: string;
  taskListName: string;
};

export type DescribeTaskListQueryKey = [
  'describeTaskList',
  DescribeTaskListQueryParams,
];

export type UseDescribeTaskListParams = DescribeTaskListQueryParams &
  Partial<
    Omit<
      UseQueryOptions<
        DescribeTaskListResponse,
        Error,
        DescribeTaskListResponse,
        DescribeTaskListQueryKey
      >,
      'queryKey' | 'queryFn' | 'enabled'
    >
  >;

export type UseDescribeTaskListResult = {
  data: DescribeTaskListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};
