import { createElement } from 'react';

import DateFilter from '@/components/date-filter/date-filter';
import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import stringifyDateFilterValue from '@/components/date-filter/helpers/stringify-date-filter-value';
import MultiSelectFilter from '@/components/multi-select-filter/multi-select-filter';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

// Mirrors domainWorkflowsFiltersConfig but bound to the batch-specific query
// params, so the batch action draft's "Select" mode filters do not share state
// with the workflows tab.
const domainBatchActionsFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { batchActionStatuses: Array<WorkflowStatus> | undefined }
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    {
      batchActionTimeRangeStart: DateFilterValue | undefined;
      batchActionTimeRangeEnd: DateFilterValue | undefined;
    }
  >,
] = [
  {
    id: 'statuses',
    getValue: (v) => ({ batchActionStatuses: v.batchActionStatuses }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(MultiSelectFilter<WorkflowStatus>, {
        label: 'Status',
        placeholder: 'Show all statuses',
        values: value.batchActionStatuses ?? [],
        onChangeValues: (v) =>
          setValue({ batchActionStatuses: v.length > 0 ? v : undefined }),
        optionsLabelMap: WORKFLOW_STATUS_NAMES,
      }),
  },
  {
    id: 'dates',
    getValue: (v) => ({
      batchActionTimeRangeStart: v.batchActionTimeRangeStart,
      batchActionTimeRangeEnd: v.batchActionTimeRangeEnd,
    }),
    formatValue: (v) => ({
      batchActionTimeRangeStart: v.batchActionTimeRangeStart
        ? stringifyDateFilterValue(v.batchActionTimeRangeStart)
        : undefined,
      batchActionTimeRangeEnd: v.batchActionTimeRangeEnd
        ? stringifyDateFilterValue(v.batchActionTimeRangeEnd)
        : undefined,
    }),
    component: ({ value, setValue }) =>
      createElement(DateFilter, {
        label: 'Time range',
        placeholder: 'Select time range',
        dates: {
          start: value.batchActionTimeRangeStart,
          end: value.batchActionTimeRangeEnd,
        },
        onChangeDates: ({ start, end }) =>
          setValue({
            batchActionTimeRangeStart: start,
            batchActionTimeRangeEnd: end,
          }),
      }),
  },
] as const;

export default domainBatchActionsFiltersConfig;
