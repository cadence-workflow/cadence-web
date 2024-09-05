import { type DescribeTaskListResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/DescribeTaskListResponse';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import { type Poller } from '../describe-task-list.types';

export default function getPollersForTaskList({
  decisionTaskList,
  activityTaskList,
}: {
  decisionTaskList: DescribeTaskListResponse | undefined;
  activityTaskList: DescribeTaskListResponse | undefined;
}): Array<Poller> {
  const decisionPollers = decisionTaskList?.pollers ?? [];
  const activityPollers = activityTaskList?.pollers ?? [];
  const pollerMap = new Map<string, Poller>();

  decisionPollers.forEach((poller) => {
    pollerMap.set(poller.identity, {
      ...poller,
      lastAccessTime: poller.lastAccessTime
        ? parseGrpcTimestamp(poller.lastAccessTime)
        : undefined,
      decisionHandler: true,
      activityHandler: false,
    });
  });

  activityPollers.forEach((poller) => {
    const decisionPoller = pollerMap.get(poller.identity);
    if (decisionPoller) {
      pollerMap.set(poller.identity, {
        ...decisionPoller,
        lastAccessTime: poller.lastAccessTime
          ? Math.max(
              decisionPoller.lastAccessTime ?? 0,
              parseGrpcTimestamp(poller.lastAccessTime)
            )
          : undefined,
        activityHandler: true,
      });
    } else {
      pollerMap.set(poller.identity, {
        ...poller,
        lastAccessTime: poller.lastAccessTime
          ? parseGrpcTimestamp(poller.lastAccessTime)
          : undefined,
        decisionHandler: false,
        activityHandler: true,
      });
    }
  });

  return Array.from(pollerMap.values());
}
