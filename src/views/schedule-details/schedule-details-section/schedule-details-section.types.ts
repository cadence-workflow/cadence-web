import { type ScheduleDetailsTableRow } from '@/views/schedule-details/schedule-details-table/schedule-details-table.types';

export type Props = {
  title: string;
  rows: ScheduleDetailsTableRow[];
  initiallyCollapsed?: boolean;
};
