import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import { type ScheduleDetailsTableRow } from '@/views/schedule-details/schedule-details-table/schedule-details-table.types';
import { type SchedulePageTabsParams } from '@/views/schedule-page/schedule-page-tabs/schedule-page-tabs.types';
import { type DescribeScheduleResponse } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

type FormattedWorkflowInput = PrettyJsonValue | null;

type FormattedWorkflowMemo = {
  fields: PrettyJsonValue;
} | null;

type FormattedStartWorkflow = Omit<
  NonNullable<NonNullable<DescribeScheduleResponse['action']>['startWorkflow']>,
  'input' | 'memo'
> & {
  input: FormattedWorkflowInput;
  memo: FormattedWorkflowMemo;
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
