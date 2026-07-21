import { useWatch, type FieldPath } from 'react-hook-form';

import useDebouncedValue from '@/hooks/use-debounced-value/use-debounced-value';

import getTaskListCaptionMessage from '../helpers/get-task-list-caption-message';

import useDescribeTaskList from './use-describe-task-list';
import { TASK_LIST_DEBOUNCE_MS } from './use-describe-task-list.constants';
import {
  type TaskListFieldValues,
  type UseTaskListFieldValidationParams,
  type UseTaskListFieldValidationResult,
} from './use-task-list-field-validation.types';

export default function useTaskListFieldValidation<
  TFieldValues extends TaskListFieldValues,
>({
  control,
  domain,
  cluster,
}: UseTaskListFieldValidationParams<TFieldValues>): UseTaskListFieldValidationResult {
  const taskListName = useWatch({
    control,
    name: 'taskList.name' as FieldPath<TFieldValues>,
  });

  // Search with the trimmed value so leading/trailing spaces in the input
  // don't change the lookup (the field itself keeps the user's raw text).
  const trimmedTaskListName = String(taskListName ?? '').trim();

  const { debouncedValue: debouncedTaskListName, isDebouncePending } =
    useDebouncedValue(trimmedTaskListName, TASK_LIST_DEBOUNCE_MS);

  const {
    data: taskListData,
    isLoading: isTaskListQueryLoading,
    isError: isTaskListError,
  } = useDescribeTaskList({
    domain,
    cluster,
    taskListName: debouncedTaskListName,
    // do not cache task list data to avoid stale data when worker presence changes
    staleTime: 0,
    gcTime: 0,
  });

  const isTaskListLoading =
    (isDebouncePending && trimmedTaskListName.length > 0) ||
    isTaskListQueryLoading;

  const taskListCaptionMessage = getTaskListCaptionMessage({
    taskListData,
    isTaskListLoading,
    isTaskListError,
    taskListName: String(taskListName ?? ''),
  });

  return { isTaskListLoading, taskListCaptionMessage };
}
