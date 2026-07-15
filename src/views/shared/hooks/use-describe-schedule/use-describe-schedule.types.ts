import { type UseQueryOptions } from '@tanstack/react-query';

import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import {
  type DescribeScheduleResponse,
  type RouteParams as DescribeScheduleRouteParams,
} from '@/route-handlers/describe-schedule/describe-schedule.types';
import { type RequestError } from '@/utils/request/request-error';
import { type Props as TaskListLinkProps } from '@/views/shared/workflow-history-event-details-task-list-link/workflow-history-event-details-task-list-link.types';

export { type DescribeScheduleResponse };

type StartWorkflow = NonNullable<
  NonNullable<DescribeScheduleResponse['action']>['startWorkflow']
>;

type FormattedWorkflowInput = PrettyJsonValue | null;

type FormattedWorkflowMemo = {
  fields: Record<string, unknown>;
} | null;

type FormattedWorkflowSearchAttributes = {
  indexedFields: PrettyJsonValue;
} | null;

type FormattedRetryPolicy = PrettyJsonValue | null;

type FormattedTaskList = Omit<
  NonNullable<StartWorkflow['taskList']>,
  'kind'
> & {
  kind: NonNullable<TaskListLinkProps['taskList']>['kind'];
};

type FormattedStartWorkflow = Omit<
  StartWorkflow,
  'input' | 'memo' | 'retryPolicy' | 'taskList' | 'searchAttributes'
> & {
  input: FormattedWorkflowInput;
  memo: FormattedWorkflowMemo;
  searchAttributes: FormattedWorkflowSearchAttributes;
  retryPolicy: FormattedRetryPolicy;
  taskList: FormattedTaskList | null;
};

export type FormattedScheduleDetails = Omit<
  DescribeScheduleResponse,
  'memo' | 'action'
> & {
  action:
    | (NonNullable<DescribeScheduleResponse['action']> & {
        startWorkflow: FormattedStartWorkflow | null;
      })
    | null;
};

export type DescribeScheduleQueryKey = [
  'describeSchedule',
  DescribeScheduleRouteParams,
];

export type UseDescribeScheduleParams = DescribeScheduleRouteParams & {
  runningScheduleRefetchIntervalMs?: number;
} & Partial<UseDescribeScheduleQueryOptions>;

export type UseDescribeScheduleQueryOptions = UseQueryOptions<
  FormattedScheduleDetails,
  RequestError,
  FormattedScheduleDetails,
  DescribeScheduleQueryKey
>;
