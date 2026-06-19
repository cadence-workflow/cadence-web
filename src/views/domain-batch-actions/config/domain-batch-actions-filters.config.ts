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
    { batchStatuses: Array<WorkflowStatus> | undefined }
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    {
      batchTimeRangeStart: DateFilterValue | undefined;
      batchTimeRangeEnd: DateFilterValue | undefined;
    }
  >,
] = [
  {
    id: 'statuses',
    getValue: (v) => ({ batchStatuses: v.batchStatuses }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(MultiSelectFilter<WorkflowStatus>, {
        label: 'Status',
        placeholder: 'Show all statuses',
        values: value.batchStatuses ?? [],
        onChangeValues: (v) =>
          setValue({ batchStatuses: v.length > 0 ? v : undefined }),
        optionsLabelMap: WORKFLOW_STATUS_NAMES,
      }),
  },
  {
    id: 'dates',
    getValue: (v) => ({
      batchTimeRangeStart: v.batchTimeRangeStart,
      batchTimeRangeEnd: v.batchTimeRangeEnd,
    }),
    formatValue: (v) => ({
      batchTimeRangeStart: v.batchTimeRangeStart
        ? stringifyDateFilterValue(v.batchTimeRangeStart)
        : undefined,
      batchTimeRangeEnd: v.batchTimeRangeEnd
        ? stringifyDateFilterValue(v.batchTimeRangeEnd)
        : undefined,
    }),
    component: ({ value, setValue }) =>
      createElement(DateFilter, {
        label: 'Time range',
        placeholder: 'Select time range',
        dates: {
          start: value.batchTimeRangeStart,
          end: value.batchTimeRangeEnd,
        },
        onChangeDates: ({ start, end }) =>
          setValue({ batchTimeRangeStart: start, batchTimeRangeEnd: end }),
      }),
  },
] as const;

export default domainBatchActionsFiltersConfig;
