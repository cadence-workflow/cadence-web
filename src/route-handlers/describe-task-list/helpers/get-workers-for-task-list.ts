import { type DescribeTaskListResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeTaskListResponse';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import { type Worker } from '../describe-task-list.types';

export default function getWorkersForTaskList({
  decisionTaskList,
  activityTaskList,
}: {
  decisionTaskList: DescribeTaskListResponse | undefined;
  activityTaskList: DescribeTaskListResponse | undefined;
}): Array<Worker> {
  const decisionWorkers = decisionTaskList?.pollers ?? [];
  const activityWorkers = activityTaskList?.pollers ?? [];
  const workerMap = new Map<string, Worker>();

  decisionWorkers.forEach((worker) => {
    workerMap.set(worker.identity, {
      ...worker,
      lastAccessTime: worker.lastAccessTime
        ? parseGrpcTimestamp(worker.lastAccessTime)
        : undefined,
      hasDecisionHandler: true,
      hasActivityHandler: false,
    });
  });

  activityWorkers.forEach((worker) => {
    const decisionWorker = workerMap.get(worker.identity);
    if (decisionWorker) {
      workerMap.set(worker.identity, {
        ...decisionWorker,
        lastAccessTime: worker.lastAccessTime
          ? Math.max(
              decisionWorker.lastAccessTime ?? 0,
              parseGrpcTimestamp(worker.lastAccessTime)
            )
          : undefined,
        hasActivityHandler: true,
      });
    } else {
      workerMap.set(worker.identity, {
        ...worker,
        lastAccessTime: worker.lastAccessTime
          ? parseGrpcTimestamp(worker.lastAccessTime)
          : undefined,
        hasDecisionHandler: false,
        hasActivityHandler: true,
      });
    }
  });

  return Array.from(workerMap.values());
}
