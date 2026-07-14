import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import { type ScheduleDetailsTableRow } from '@/views/schedule-details/schedule-details-table/schedule-details-table.types';
import { type SchedulePageTabsParams } from '@/views/schedule-page/schedule-page-tabs/schedule-page-tabs.types';
import { type DescribeScheduleResponse } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';
import { type Props as TaskListLinkProps } from '@/views/shared/workflow-history-event-details-task-list-link/workflow-history-event-details-task-list-link.types';

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

export type Props = {
  params: SchedulePageTabsParams;
};

export type ScheduleDetailRowArgs = {
  formattedScheduleDetails: FormattedScheduleDetails;
  scheduleId: string;
  domain: string;
  cluster: string;
};

export type ScheduleDetailRowConfig = {
  key: string;
  getLabel: () => string;
  getValue: (args: ScheduleDetailRowArgs) => ScheduleDetailsTableRow['value'];
  hide?: (args: ScheduleDetailRowArgs) => boolean;
};

export type ScheduleDetailsSectionConfig = {
  key: string;
  title: string;
  rowsConfig: ScheduleDetailRowConfig[];
};
