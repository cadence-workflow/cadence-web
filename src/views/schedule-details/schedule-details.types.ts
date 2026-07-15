import { type ScheduleDetailsTableRow } from '@/views/schedule-details/schedule-details-table/schedule-details-table.types';
import { type SchedulePageTabsParams } from '@/views/schedule-page/schedule-page-tabs/schedule-page-tabs.types';
import { type FormattedScheduleDetails } from '@/views/shared/hooks/use-describe-schedule/use-describe-schedule.types';

export type { FormattedScheduleDetails };

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
