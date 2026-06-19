import { type ReadOnlyDetailsTableRow } from '@/components/read-only-details-table/read-only-details-table.types';
import { type DescribeScheduleResponse } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

export type ScheduleDetailRowArgs = {
  describeSchedule: DescribeScheduleResponse;
  scheduleId: string;
};

export type ScheduleDetailRowConfig = {
  key: string;
  getLabel: () => string;
  getValue: (args: ScheduleDetailRowArgs) => ReadOnlyDetailsTableRow['value'];
  hide?: (args: ScheduleDetailRowArgs) => boolean;
};

export type ScheduleDetailsSectionConfig = {
  key: string;
  title: string;
  rowsConfig: ScheduleDetailRowConfig[];
};
