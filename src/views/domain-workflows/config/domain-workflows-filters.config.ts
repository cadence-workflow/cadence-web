import { createElement } from 'react';

import DatePicker from '@/components/date-picker/date-picker';
import ListPicker from '@/components/list-picker/list-picker';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import { WORKFLOW_CRON_LABELS } from '../domain-workflows-header/domain-workflows-header.constants';
import { type WorkflowCronValue } from '../domain-workflows-header/domain-workflows-header.types';

const domainWorkflowsFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { status: WorkflowStatus | undefined }
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { timeRangeStart: Date | undefined; timeRangeEnd: Date | undefined }
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { cron: WorkflowCronValue | undefined }
  >,
] = [
  {
    id: 'status',
    getValue: (v) => ({ status: v.status }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(ListPicker<WorkflowStatus>, {
        label: 'Status',
        placeholder: 'Show all statuses',
        value: value.status,
        setValue: (v) => setValue({ status: v }),
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
      createElement(DatePicker, {
        label: 'Dates',
        placeholder: 'Select time range',
        dates: {
          start: value.timeRangeStart,
          end: value.timeRangeEnd,
        },
        setDates: ({ start, end }) =>
          setValue({ timeRangeStart: start, timeRangeEnd: end }),
      }),
  },
  {
    id: 'cron',
    getValue: (v) => ({ cron: v.cron }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(ListPicker<WorkflowCronValue>, {
        label: 'Cron workflows',
        placeholder: 'All',
        value: value.cron,
        setValue: (v) => setValue({ cron: v }),
        labelMap: WORKFLOW_CRON_LABELS,
      }),
  },
] as const;

export default domainWorkflowsFiltersConfig;
