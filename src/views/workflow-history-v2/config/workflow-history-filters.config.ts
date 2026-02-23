import { createElement } from 'react';

import TagFilter from '@/components/tag-filter/tag-filter';

import filterGroupsByGroupStatus from '../workflow-history-filters-menu/helpers/filter-groups-by-group-status';
import filterGroupsByGroupType from '../workflow-history-filters-menu/helpers/filter-groups-by-group-type';
import {
  type WorkflowHistoryGroupFilterType,
  type WorkflowHistoryFiltersStatusValue,
  type WorkflowHistoryFiltersTypeValue,
  type WorkflowHistoryGroupFilterStatus,
} from '../workflow-history-filters-menu/workflow-history-filters-menu.types';
import { type WorkflowHistoryFilterConfig } from '../workflow-history-v2.types';

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
      createElement(TagFilter<WorkflowHistoryGroupFilterType>, {
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
      createElement(TagFilter<WorkflowHistoryGroupFilterStatus>, {
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
