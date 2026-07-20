import {
  type PageQueryParamSetter,
  type PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import schedulePageQueryParamsConfig from '@/views/schedule-page/config/schedule-page-query-params.config';

export type Props = {
  search: string;
  setSearch: (search: string) => void;
  queryParams: PageQueryParamValues<typeof schedulePageQueryParamsConfig>;
  setQueryParams: PageQueryParamSetter<typeof schedulePageQueryParamsConfig>;
  resetAllFilters: () => void;
  activeFiltersCount: number;
};
