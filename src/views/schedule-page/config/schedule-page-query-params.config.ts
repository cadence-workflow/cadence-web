import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';

const schedulePageQueryParamsConfig: [
  PageQueryParam<'scheduleRunsSearch', string>,
] = [
  {
    key: 'scheduleRunsSearch',
    queryParamKey: 'runs-search',
    defaultValue: '',
  },
] as const;

export default schedulePageQueryParamsConfig;
