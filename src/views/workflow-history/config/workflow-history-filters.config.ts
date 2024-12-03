import filterEventsByEventStatus from '../workflow-history-filters-status/helpers/filter-events-by-event-status';
import WorkflowHistoryFiltersStatus from '../workflow-history-filters-status/workflow-history-filters-status';
import { type WorkflowHistoryFiltersStatusValue } from '../workflow-history-filters-status/workflow-history-filters-status.types';
import filterEventsByEventType from '../workflow-history-filters-type/helpers/filter-events-by-event-type';
import WorkflowHistoryFiltersType from '../workflow-history-filters-type/workflow-history-filters-type';
import { type WorkflowHistoryFiltersTypeValue } from '../workflow-history-filters-type/workflow-history-filters-type.types';
import { type WorkflowHistoryFilterConfig } from '../workflow-history.types';

const workflowHistoryFiltersConfig: [
  WorkflowHistoryFilterConfig<WorkflowHistoryFiltersTypeValue>,
  WorkflowHistoryFilterConfig<WorkflowHistoryFiltersStatusValue>,
] = [
  {
    id: 'historyEventType',
    getValue: (v) => ({ historyEventTypes: v.historyEventTypes }),
    formatValue: (v) => v,
    component: WorkflowHistoryFiltersType,
    filterFunc: filterEventsByEventType,
    filterTarget: 'event',
  },
  {
    id: 'historyEventStatus',
    getValue: (v) => ({ historyEventStatuses: v.historyEventStatuses }),
    formatValue: (v) => v,
    component: WorkflowHistoryFiltersStatus,
    filterFunc: filterEventsByEventStatus,
    filterTarget: 'group',
  },
] as const;

export default workflowHistoryFiltersConfig;
