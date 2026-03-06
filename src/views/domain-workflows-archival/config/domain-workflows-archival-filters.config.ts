import { createElement } from 'react';

import omit from 'lodash/omit';

import DateFilter from '@/components/date-filter/date-filter';
import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import stringifyDateFilterValue from '@/components/date-filter/helpers/stringify-date-filter-value';
import MultiSelectFilter from '@/components/multi-select-filter/multi-select-filter';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type domainPageQueryParamsConfig from '@/views/domain-page/config/domain-page-query-params.config';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';

import { type WorkflowStatusClosed } from '../domain-workflows-archival-header/domain-workflows-archival-header.types';

const domainWorkflowsArchivalFiltersConfig: [
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    { statusesArchival: Array<WorkflowStatusClosed> | undefined }
  >,
  PageFilterConfig<
    typeof domainPageQueryParamsConfig,
    {
      timeRangeStartArchival: DateFilterValue | undefined;
      timeRangeEndArchival: DateFilterValue | undefined;
    }
  >,
] = [
  {
    id: 'statuses',
    getValue: (v) => v,
    formatValue: (v) => v,
    component: ({ value, setValue }) =>
      createElement(MultiSelectFilter<WorkflowStatusClosed>, {
        label: 'Status',
        placeholder: 'Show all statuses',
        values: value.statusesArchival ?? [],
        onChangeValues: (v) =>
          setValue({ statusesArchival: v.length > 0 ? v : undefined }),
        optionsLabelMap: omit(
          WORKFLOW_STATUS_NAMES,
          'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID'
        ),
      }),
  },
  {
    id: 'dates',
    getValue: (v) => v,
    formatValue: (v) => ({
      timeRangeStartArchival: v.timeRangeStartArchival
        ? stringifyDateFilterValue(v.timeRangeStartArchival)
        : undefined,
      timeRangeEndArchival: v.timeRangeEndArchival
        ? stringifyDateFilterValue(v.timeRangeEndArchival)
        : undefined,
    }),
    component: ({ value, setValue }) =>
      createElement(DateFilter, {
        label: 'Time range',
        placeholder: 'Select time range',
        dates: {
          start: value.timeRangeStartArchival,
          end: value.timeRangeEndArchival,
        },
        onChangeDates: ({ start, end }) =>
          setValue({
            timeRangeStartArchival: start,
            timeRangeEndArchival: end,
          }),
      }),
  },
] as const;

export default domainWorkflowsArchivalFiltersConfig;
