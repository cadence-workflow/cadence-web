import { createElement } from 'react';

import DateFilter from '@/components/date-filter/date-filter';
import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import stringifyDateFilterValue from '@/components/date-filter/helpers/stringify-date-filter-value';
import MultiSelectFilter from '@/components/multi-select-filter/multi-select-filter';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const domainWorkflowsFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { statuses: Array<WorkflowStatus> | undefined }
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    {
      timeRangeStart: DateFilterValue | undefined;
      timeRangeEnd: DateFilterValue | undefined;
    }
  >,
] = [
  {
    id: 'statuses',
    getValue: (v) => ({ statuses: v.statuses }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(MultiSelectFilter<WorkflowStatus>, {
        label: 'Status',
        placeholder: 'Show all statuses',
        values: value.statuses ?? [],
        onChangeValues: (v) =>
          setValue({ statuses: v.length > 0 ? v : undefined }),
        optionsLabelMap: WORKFLOW_STATUS_NAMES,
      }),
  },
  {
    id: 'dates',
    getValue: (v) => ({
      timeRangeStart: v.timeRangeStart,
      timeRangeEnd: v.timeRangeEnd,
    }),
    formatValue: (v) => ({
      timeRangeStart: v.timeRangeStart
        ? stringifyDateFilterValue(v.timeRangeStart)
        : undefined,
      timeRangeEnd: v.timeRangeEnd
        ? stringifyDateFilterValue(v.timeRangeEnd)
        : undefined,
    }),
    component: ({ value, setValue }) =>
      createElement(DateFilter, {
        label: 'Time range',
        placeholder: 'Select time range',
        dates: {
          start: value.timeRangeStart,
          end: value.timeRangeEnd,
        },
        onChangeDates: ({ start, end }) =>
          setValue({ timeRangeStart: start, timeRangeEnd: end }),
      }),
  },
] as const;

export default domainWorkflowsFiltersConfig;
