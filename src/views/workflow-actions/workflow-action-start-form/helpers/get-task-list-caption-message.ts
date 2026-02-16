import { type DescribeTaskListResponse } from '@/route-handlers/describe-task-list/describe-task-list.types';

export function getTaskListWarningMessage(
  data: DescribeTaskListResponse
): string | null {
  const workers = data.taskList.workers;
  const hasDecision = workers.some((w) => w.hasDecisionHandler);
  const hasActivity = workers.some((w) => w.hasActivityHandler);

  if (!hasDecision && !hasActivity) return 'This task list has no workers';
  if (!hasDecision) return 'This task list has no decision workers';
  if (!hasActivity) return 'This task list has no activity workers';
  return null;
}

export default function getTaskListCaptionMessage({
  taskListData,
  isTaskListLoading,
  isTaskListError,
  taskListName,
}: {
  taskListData: DescribeTaskListResponse | undefined;
  isTaskListLoading: boolean;
  isTaskListError: boolean;
  taskListName: string;
}): string | null {
  if (isTaskListError && taskListName)
    return 'Error fetching task list information';
  if (!taskListData || isTaskListLoading || isTaskListError) return null;
  return getTaskListWarningMessage(taskListData);
}
