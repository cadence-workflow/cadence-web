import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import parseDateFilterValue from '@/components/date-filter/helpers/parse-date-filter-value';
import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';

const schedulePageQueryParamsConfig: [
  PageQueryParam<'scheduleRunsTimeStart', DateFilterValue | undefined>,
  PageQueryParam<'scheduleRunsTimeEnd', DateFilterValue | undefined>,
] = [
  {
    key: 'scheduleRunsTimeStart',
    queryParamKey: 'runs-start',
    parseValue: parseDateFilterValue,
  },
  {
    key: 'scheduleRunsTimeEnd',
    queryParamKey: 'runs-end',
    parseValue: (value) =>
      value === 'now' ? 'now' : parseDateFilterValue(value),
  },
] as const;

export default schedulePageQueryParamsConfig;
