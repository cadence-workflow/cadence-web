import { type PollerInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/PollerInfo';
import { type TaskListStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/TaskListStatus';

export type RouteParams = {
  domain: string;
  cluster: string;
  taskListName: string;
};

export type RequestParams = {
  params: RouteParams;
};
export type Poller = Omit<PollerInfo, 'lastAccessTime'> & {
  decisionHandler: boolean;
  activityHandler: boolean;
  lastAccessTime?: number;
};

export type TaskList = {
  name: string;
  pollers: Array<Poller>;
  activityTaskListStatus: TaskListStatus | null;
  decisionTaskListStatus: TaskListStatus | null;
};

export type DescribeTaskListResponse = {
  taskList: TaskList;
};
