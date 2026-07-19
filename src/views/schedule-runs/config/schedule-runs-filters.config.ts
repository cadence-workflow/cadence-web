import { createElement } from 'react';

import DateFilter from '@/components/date-filter/date-filter';
import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import stringifyDateFilterValue from '@/components/date-filter/helpers/stringify-date-filter-value';
import MultiSelectFilter from '@/components/multi-select-filter/multi-select-filter';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import type scheduleRunsQueryParamsConfig from './schedule-runs-query-params.config';

const scheduleRunsFiltersConfig: [
  PageFilterConfig<
    typeof scheduleRunsQueryParamsConfig,
    { scheduleRunsStatuses: Array<WorkflowStatus> | undefined }
  >,
  PageFilterConfig<
    typeof scheduleRunsQueryParamsConfig,
    {
      scheduleRunsTimeStart: DateFilterValue;
      scheduleRunsTimeEnd: DateFilterValue;
    }
  >,
] = [
  {
    id: 'statuses',
    getValue: (value) => ({
      scheduleRunsStatuses: value.scheduleRunsStatuses,
    }),
    formatValue: (value) => value,
    component: ({ value, setValue }) =>
      createElement(MultiSelectFilter<WorkflowStatus>, {
        label: 'Workflow status',
        placeholder: 'Show all statuses',
        values: value.scheduleRunsStatuses ?? [],
        onChangeValues: (statuses) =>
          setValue({
            scheduleRunsStatuses: statuses.length ? statuses : undefined,
          }),
        optionsLabelMap: WORKFLOW_STATUS_NAMES,
      }),
  },
  {
    id: 'schedule-time',
    getValue: (value) => ({
      scheduleRunsTimeStart: value.scheduleRunsTimeStart,
      scheduleRunsTimeEnd: value.scheduleRunsTimeEnd,
    }),
    formatValue: (value) => ({
      scheduleRunsTimeStart: stringifyDateFilterValue(
        value.scheduleRunsTimeStart
      ),
      scheduleRunsTimeEnd: stringifyDateFilterValue(value.scheduleRunsTimeEnd),
    }),
    component: ({ value, setValue }) =>
      createElement(DateFilter, {
        label: 'Schedule time',
        placeholder: 'Select schedule time',
        dates: {
          start: value.scheduleRunsTimeStart,
          end: value.scheduleRunsTimeEnd,
        },
        onChangeDates: ({ start, end }) =>
          setValue({
            scheduleRunsTimeStart: start ?? 'now-7d',
            scheduleRunsTimeEnd: end ?? 'now',
          }),
      }),
  },
] as const;

export default scheduleRunsFiltersConfig;
