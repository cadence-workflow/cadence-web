import { createElement } from 'react';

import TagFilter from '@/components/tag-filter/tag-filter';
import filterGroupsByGroupStatus from '@/views/workflow-history/workflow-history-filters-status/helpers/filter-groups-by-group-status';
import {
  type HistoryEventFilterStatus,
  type WorkflowHistoryFiltersStatusValue,
} from '@/views/workflow-history/workflow-history-filters-status/workflow-history-filters-status.types';
import filterGroupsByGroupType from '@/views/workflow-history/workflow-history-filters-type/helpers/filter-groups-by-group-type';
import {
  type WorkflowHistoryEventFilteringType,
  type WorkflowHistoryFiltersTypeValue,
} from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';
import { type WorkflowHistoryFilterConfig } from '@/views/workflow-history/workflow-history.types';

import workflowHistoryFiltersStatusOptionsConfig from './workflow-history-filters-status-options.config';
import workflowHistoryFiltersTypeOptionsConfig from './workflow-history-filters-type-options.config';

const workflowHistoryFiltersConfig: [
  WorkflowHistoryFilterConfig<WorkflowHistoryFiltersTypeValue>,
  WorkflowHistoryFilterConfig<WorkflowHistoryFiltersStatusValue>,
] = [
  {
    id: 'historyEventTypes',
    getValue: (v) => ({ historyEventTypes: v.historyEventTypes }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(TagFilter<WorkflowHistoryEventFilteringType>, {
        label: 'Type',
        values: value.historyEventTypes ?? [],
        onChangeValues: (newValues) =>
          setValue({
            historyEventTypes: newValues.length > 0 ? newValues : undefined,
          }),
        optionsConfig: workflowHistoryFiltersTypeOptionsConfig,
      }),
    filterFunc: filterGroupsByGroupType,
  },
  {
    id: 'historyEventStatuses',
    getValue: (v) => ({ historyEventStatuses: v.historyEventStatuses }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(TagFilter<HistoryEventFilterStatus>, {
        label: 'Status',
        values: value.historyEventStatuses ?? [],
        onChangeValues: (newValues) =>
          setValue({
            historyEventStatuses: newValues.length > 0 ? newValues : undefined,
          }),
        optionsConfig: workflowHistoryFiltersStatusOptionsConfig,
      }),
    filterFunc: filterGroupsByGroupStatus,
  },
] as const;

export default workflowHistoryFiltersConfig;
