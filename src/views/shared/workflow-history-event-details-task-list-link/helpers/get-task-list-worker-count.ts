import { type Worker } from '@/route-handlers/describe-task-list/describe-task-list.types';

import { type TaskListHandlerKind } from '../workflow-history-event-details-task-list-link.types';

export default function getTaskListWorkerCount(
  workers: Array<Worker>,
  handlerKind: TaskListHandlerKind
): number {
  if (handlerKind === 'decision') {
    return workers.filter((worker) => worker.hasDecisionHandler).length;
  }
  if (handlerKind === 'activity') {
    return workers.filter((worker) => worker.hasActivityHandler).length;
  }
  return workers.length;
}
