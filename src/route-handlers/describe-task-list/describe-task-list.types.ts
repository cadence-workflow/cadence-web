import { type PollerInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/PollerInfo';
import { type TaskListStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/TaskListStatus';
import { type DefaultMiddlewaresContext } from '@/utils/route-handlers-middleware';

export type RouteParams = {
  domain: string;
  cluster: string;
  taskListName: string;
};

export type RequestParams = {
  params: RouteParams;
};

export type Worker = Omit<PollerInfo, 'lastAccessTime'> & {
  hasDecisionHandler: boolean;
  hasActivityHandler: boolean;
  lastAccessTime?: number;
};

export type TaskList = {
  name: string;
  workers: Array<Worker>;
  activityTaskListStatus: TaskListStatus | null;
  decisionTaskListStatus: TaskListStatus | null;
};

export type DescribeTaskListResponse = {
  taskList: TaskList;
};

export type Context = DefaultMiddlewaresContext;
