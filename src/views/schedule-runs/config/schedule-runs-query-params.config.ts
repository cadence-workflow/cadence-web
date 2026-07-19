import { type DateFilterValue } from '@/components/date-filter/date-filter.types';
import parseDateFilterValue from '@/components/date-filter/helpers/parse-date-filter-value';
import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';

const scheduleRunsQueryParamsConfig: [
  PageQueryParam<'scheduleRunsTimeStart', DateFilterValue>,
  PageQueryParam<'scheduleRunsTimeEnd', DateFilterValue>,
] = [
  {
    key: 'scheduleRunsTimeStart',
    queryParamKey: 'runs-start',
    defaultValue: 'now-7d',
    parseValue: (value) => parseDateFilterValue(value) ?? 'now-7d',
  },
  {
    key: 'scheduleRunsTimeEnd',
    queryParamKey: 'runs-end',
    defaultValue: 'now',
    parseValue: (value) => parseDateFilterValue(value) ?? 'now',
  },
] as const;

export default scheduleRunsQueryParamsConfig;
