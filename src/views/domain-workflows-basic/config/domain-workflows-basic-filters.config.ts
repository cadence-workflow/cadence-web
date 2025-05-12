import { createElement } from 'react';

import DateFilterV2 from '@/components/date-filter-v2/date-filter-v2';
import { type DateFilterValue } from '@/components/date-filter-v2/date-filter-v2.types';
import stringifyDateFilterValue from '@/components/date-filter-v2/helpers/stringify-date-filter-value';
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
      timeRangeStartBasic: DateFilterValue | undefined;
      timeRangeEndBasic: DateFilterValue | undefined;
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
      timeRangeStartBasic: v.timeRangeStartBasic
        ? stringifyDateFilterValue(v.timeRangeStartBasic)
        : undefined,
      timeRangeEndBasic: v.timeRangeEndBasic
        ? stringifyDateFilterValue(v.timeRangeEndBasic)
        : undefined,
    }),
    component: ({ value, setValue }) =>
      createElement(DateFilterV2, {
        label: 'Time range',
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
      }),
  },
] as const;

export default domainWorkflowsBasicFiltersConfig;
