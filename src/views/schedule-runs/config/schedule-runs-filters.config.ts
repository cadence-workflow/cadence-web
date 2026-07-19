import { createElement } from 'react';

import DateFilter from '@/components/date-filter/date-filter';
import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import stringifyDateFilterValue from '@/components/date-filter/helpers/stringify-date-filter-value';
import { type PageFilterConfig } from '@/components/page-filters/page-filters.types';
import type schedulePageQueryParamsConfig from '@/views/schedule-page/config/schedule-page-query-params.config';

const scheduleRunsFiltersConfig: [
  PageFilterConfig<
    typeof schedulePageQueryParamsConfig,
    {
      scheduleRunsTimeStart: DateFilterValue;
      scheduleRunsTimeEnd: DateFilterValue;
    }
  >,
] = [
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
