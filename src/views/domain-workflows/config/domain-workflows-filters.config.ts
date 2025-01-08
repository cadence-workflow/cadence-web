import { createElement } from 'react';

import DateFilter from '@/components/date-filter/date-filter';
import ListFilter from '@/components/list-filter/list-filter';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

const domainWorkflowsFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { status: WorkflowStatus | undefined }
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { timeRangeStart: Date | undefined; timeRangeEnd: Date | undefined }
  >,
] = [
  {
    id: 'status',
    getValue: (v) => ({ status: v.status }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(ListFilter<WorkflowStatus>, {
        label: 'Status',
        placeholder: 'Show all statuses',
        value: value.status,
        onChangeValue: (v) => setValue({ status: v }),
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
      timeRangeStart: v.timeRangeStart?.toISOString(),
      timeRangeEnd: v.timeRangeEnd?.toISOString(),
    }),
    component: ({ value, setValue }) =>
      createElement(DateFilter, {
        label: 'Dates',
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
