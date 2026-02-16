import { useQuery } from '@tanstack/react-query';

import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';
import request from '@/utils/request';

import { type UseDescribeTaskListParams } from './use-describe-task-list.types';

export default function useDescribeTaskList({
  domain,
  cluster,
  taskListName,
}: UseDescribeTaskListParams) {
  const queryResult = useQuery<DescribeTaskListResponse>({
    queryKey: ['describeTaskList', domain, cluster, taskListName],
    queryFn: () =>
      request(
        `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/task-list/${encodeURIComponent(taskListName)}`
      ).then((res) => res.json()),
    enabled: taskListName.length > 0,
    retry: false,
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isFetching,
    isError: queryResult.isError,
    error: queryResult.error,
  };
}
