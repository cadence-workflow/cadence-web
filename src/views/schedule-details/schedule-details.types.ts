import { type ScheduleDetailsTableRow } from '@/views/schedule-details/schedule-details-table/schedule-details-table.types';
import { type SchedulePageTabsParams } from '@/views/schedule-page/schedule-page-tabs/schedule-page-tabs.types';
import { type DescribeScheduleResponse } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

export type Props = {
  params: SchedulePageTabsParams;
};

export type ScheduleDetailRowArgs = {
  describeSchedule: DescribeScheduleResponse;
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
