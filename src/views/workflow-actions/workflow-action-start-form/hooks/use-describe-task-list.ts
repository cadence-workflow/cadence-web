import { useState, useEffect, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';

import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';

import { TASK_LIST_DEBOUNCE_MS } from './use-describe-task-list.constants';
import { type UseDescribeTaskListParams } from './use-describe-task-list.types';

export default function useDescribeTaskList({
  domain,
  cluster,
  taskListName,
}: UseDescribeTaskListParams) {
  const [debouncedTaskListName, setDebouncedTaskListName] =
    useState(taskListName);

  const setDebouncedValue = useMemo(
    () => debounce(setDebouncedTaskListName, TASK_LIST_DEBOUNCE_MS),
    []
  );

  useEffect(() => {
    setDebouncedValue(taskListName);
    return () => {
      setDebouncedValue.cancel();
    };
  }, [taskListName, setDebouncedValue]);

  const queryResult = useQuery<DescribeTaskListResponse>({
    queryKey: ['describeTaskList', domain, cluster, debouncedTaskListName],
    queryFn: () =>
      fetch(
        `/api/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/task-list/${encodeURIComponent(debouncedTaskListName)}`
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || 'Error fetching task list');
          });
        }
        return res.json();
      }),
    enabled: debouncedTaskListName.length > 0,
    retry: false,
  });

  // Consider loading when the input has changed but debounce hasn't fired yet
  const isDebouncePending =
    taskListName !== debouncedTaskListName && taskListName.length > 0;

  return {
    data: queryResult.data,
    isLoading: isDebouncePending || queryResult.isFetching,
    isError: queryResult.isError,
    error: queryResult.error,
  };
}
