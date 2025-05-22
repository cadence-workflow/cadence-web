import { createElement } from 'react';

import DateFilterV2 from '@/components/date-filter-v2/date-filter-v2';
import { type DateFilterValue } from '@/components/date-filter-v2/date-filter-v2.types';
import stringifyDateFilterValue from '@/components/date-filter-v2/helpers/stringify-date-filter-value';
import ListFilterMulti from '@/components/list-filter-multi/list-filter-multi';
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
      createElement(ListFilterMulti<WorkflowStatus>, {
        label: 'Status',
        placeholder: 'Show all statuses',
        values: value.statuses,
        onChangeValues: (v) => setValue({ statuses: v }),
        labelMap: WORKFLOW_STATUS_NAMES,
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
      createElement(DateFilterV2, {
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
