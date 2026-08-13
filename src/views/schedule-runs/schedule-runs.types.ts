import { type SortOrder } from '@/utils/sort-by';
import { type SchedulePageTabContentProps } from '@/views/schedule-page/schedule-page-tabs/schedule-page-tabs.types';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

export type Props = SchedulePageTabContentProps;

export type ScheduleRunsRunType = 'all' | 'backfill' | 'regular';

export type ScheduleRunsQueryFilters = {
  search?: string;
  isPartialMatchingEnabled?: boolean;
  timeRangeStart?: string;
  timeRangeEnd?: string;
  statuses?: Array<WorkflowStatus>;
  runType?: ScheduleRunsRunType;
  sortOrder?: SortOrder;
};
