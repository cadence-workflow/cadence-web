import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type SortOrder } from '@/utils/sort-by';

const schedulePageQueryParamsConfig: [
  PageQueryParam<'scheduleRunsSortOrder', SortOrder>,
] = [
  {
    key: 'scheduleRunsSortOrder',
    queryParamKey: 'runs-order',
    defaultValue: 'DESC',
    parseValue: (value) => (value === 'ASC' ? 'ASC' : 'DESC'),
  },
] as const;

export default schedulePageQueryParamsConfig;
