import { createElement } from 'react';

import DateFilter from '@/components/date-filter/date-filter';
import ListFilter from '@/components/list-filter/list-filter';
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
    {
      timeRangeStartBasic: Date | undefined;
      timeRangeEndBasic: Date | undefined;
    }
  >,
] = [
  {
    id: 'status',
    getValue: (v) => ({ statusBasic: v.statusBasic }),
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(ListFilter<WorkflowStatusBasicVisibility>, {
        label: 'Status',
        placeholder: 'Show all statuses',
        value: value.statusBasic,
        onChangeValue: (v) => setValue({ statusBasic: v }),
        labelMap: WORKFLOW_STATUS_NAMES_BASIC_VISIBILITY,
      }),
  },
  {
    id: 'dates',
    getValue: (v) => ({
      timeRangeStartBasic: v.timeRangeStartBasic,
      timeRangeEndBasic: v.timeRangeEndBasic,
    }),
    formatValue: (v) => ({
      timeRangeStartBasic: v.timeRangeStartBasic?.toISOString(),
      timeRangeEndBasic: v.timeRangeEndBasic?.toISOString(),
    }),
    component: ({ value, setValue }) =>
      createElement(DateFilter, {
        label: 'Dates',
        placeholder: 'Select time range',
        dates: {
          start: value.timeRangeStartBasic,
          end: value.timeRangeEndBasic,
        },
        onChangeDates: ({ start, end }) =>
          setValue({
            timeRangeStartBasic: start,
            timeRangeEndBasic: end,
          }),
        clearable: false,
      }),
  },
] as const;

export default domainWorkflowsBasicFiltersConfig;
