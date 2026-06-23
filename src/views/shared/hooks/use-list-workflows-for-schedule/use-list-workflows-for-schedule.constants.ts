import { type SortOrder } from '@/utils/sort-by';

// HITL literals — must match cluster visibility search-attribute registration.
export const SCHEDULE_WORKFLOWS_VISIBILITY_QUERY_ATTRIBUTE = 'CadenceScheduleID';
export const SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN = 'CadenceScheduleTime';
export const SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER = 'DESC' satisfies SortOrder;
