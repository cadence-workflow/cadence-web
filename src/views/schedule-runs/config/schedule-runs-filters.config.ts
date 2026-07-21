import { createElement } from 'react';

import DateFilter from '@/components/date-filter/date-filter';
import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import stringifyDateFilterValue from '@/components/date-filter/helpers/stringify-date-filter-value';
import ListFilter from '@/components/list-filter/list-filter';
import MultiSelectFilter from '@/components/multi-select-filter/multi-select-filter';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type schedulePageQueryParamsConfig from '@/views/schedule-page/config/schedule-page-query-params.config';
import { WORKFLOW_STATUS_NAMES } from '@/views/shared/workflow-status-tag/workflow-status-tag.constants';
import { type WorkflowStatus } from '@/views/shared/workflow-status-tag/workflow-status-tag.types';

import { type ScheduleRunsRunType } from '../schedule-runs.types';

const RUN_TYPE_LABELS: Record<ScheduleRunsRunType, string> = {
  all: 'All',
  backfill: 'Backfill',
  regular: 'Regular',
};

const scheduleRunsFiltersConfig: [
  PageFilterConfig<
    typeof schedulePageQueryParamsConfig,
    { scheduleRunsStatuses: Array<WorkflowStatus> | undefined }
  >,
  PageFilterConfig<
    typeof schedulePageQueryParamsConfig,
    {
      scheduleRunsTimeStart: DateFilterValue | undefined;
      scheduleRunsTimeEnd: DateFilterValue | undefined;
    }
  >,
  PageFilterConfig<
    typeof schedulePageQueryParamsConfig,
    { scheduleRunsRunType: ScheduleRunsRunType }
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
      scheduleRunsTimeStart: value.scheduleRunsTimeStart
        ? stringifyDateFilterValue(value.scheduleRunsTimeStart)
        : undefined,
      scheduleRunsTimeEnd: value.scheduleRunsTimeEnd
        ? stringifyDateFilterValue(value.scheduleRunsTimeEnd)
        : undefined,
    }),
    component: ({ value, setValue }) =>
      createElement(DateFilter, {
        label: 'Schedule time',
        placeholder: 'Select schedule time',
        clearable: true,
        dates: {
          start: value.scheduleRunsTimeStart,
          end: value.scheduleRunsTimeEnd,
        },
        onChangeDates: ({ start, end }) =>
          setValue({
            scheduleRunsTimeStart: start,
            scheduleRunsTimeEnd: end,
          }),
      }),
  },
  {
    id: 'run-type',
    getValue: (value) => ({
      scheduleRunsRunType: value.scheduleRunsRunType,
    }),
    formatValue: (value) => value,
    component: ({ value, setValue }) =>
      createElement(ListFilter<ScheduleRunsRunType>, {
        label: 'Run type',
        placeholder: 'All runs',
        value: value.scheduleRunsRunType,
        onChangeValue: (runType) =>
          setValue({ scheduleRunsRunType: runType ?? 'all' }),
        labelMap: RUN_TYPE_LABELS,
        clearable: false,
      }),
  },
] as const;

export default scheduleRunsFiltersConfig;
