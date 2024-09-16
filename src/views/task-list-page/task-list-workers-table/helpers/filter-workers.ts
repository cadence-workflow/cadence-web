import { type TaskListType } from '@/__generated__/proto-ts/uber/cadence/api/v1/TaskListType';
import { type Worker } from '@/route-handlers/describe-task-list/describe-task-list.types';

export default function filterWorkers({
  workers,
  handlerType,
  search,
}: {
  workers: Array<Worker>;
  handlerType?: TaskListType;
  search?: string;
}) {
  let filteredWorkers = workers;

  if (handlerType === 'TASK_LIST_TYPE_ACTIVITY') {
    filteredWorkers = filteredWorkers.filter((w) => w.hasActivityHandler);
  } else if (handlerType === 'TASK_LIST_TYPE_DECISION') {
    filteredWorkers = filteredWorkers.filter((w) => w.hasDecisionHandler);
  }

  if (search) {
    filteredWorkers = filteredWorkers.filter((w) =>
      w.identity.includes(search)
    );
  }

  return filteredWorkers;
}
