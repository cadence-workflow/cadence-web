import { createElement } from 'react';

import DatePicker from '@/components/date-picker/date-picker';
import ListPicker from '@/components/list-picker/list-picker';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';

import { WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY } from '../domain-workflows-basic-filters/domain-workflows-basic-filters.constants';
import { type WorkflowStatusBasicVisibility } from '../domain-workflows-basic-filters/domain-workflows-basic-filters.types';

const domainWorkflowsBasicFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { statusBasic: WorkflowStatusBasicVisibility | undefined }
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { timeRangeStart: Date | undefined; timeRangeEnd: Date | undefined }
  >,
] = [
  {
    id: 'status',
    getValue: (v) => ({ statusBasic: v.statusBasic }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(ListPicker<WorkflowStatusBasicVisibility>, {
        label: 'Status',
        placeholder: 'Show all statuses',
        value: value.statusBasic,
        setValue: (v) => setValue({ statusBasic: v }),
        labelMap: WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY,
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
        clearable: false,
      }),
  },
] as const;

export default domainWorkflowsBasicFiltersConfig;
