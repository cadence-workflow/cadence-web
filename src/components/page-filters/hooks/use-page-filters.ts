import { useMemo, useCallback } from 'react';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import {
  type PageQueryParams,
  type PageQueryParamKeys,
  type PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

import { type PageFilterConfig } from '../page-filters.types';

export default function usePageFilters<P extends PageQueryParams>({
  pageFiltersConfig,
  pageQueryParamsConfig,
}: {
  pageFiltersConfig: Array<PageFilterConfig<P, any>>;
  pageQueryParamsConfig: P;
}) {
  const [queryParams, setQueryParams] = usePageQueryParams(
    pageQueryParamsConfig,
    { pageRerender: false }
  );

  const activeFiltersCount = useMemo(() => {
    const configsByKey = Object.fromEntries(
      pageQueryParamsConfig.map((c) => [c.key, c])
    );
    return pageFiltersConfig.filter((pageFilter) =>
      Object.keys(pageFilter.getValue(queryParams)).every(
        (queryParamKey: PageQueryParamKeys<P>) =>
          queryParams[queryParamKey] &&
          queryParams[queryParamKey] !==
            configsByKey[queryParamKey].defaultValue
      )
    ).length;
  }, [pageFiltersConfig, pageQueryParamsConfig, queryParams]);

  const resetAllFilters = useCallback(() => {
    const emptyQueryParamsObject = pageQueryParamsConfig.reduce(
      (acc, config) => ({
        ...acc,
        [config.key]: undefined,
      }),
      {}
    ) as PageQueryParamValues<P>;

    setQueryParams(
      pageFiltersConfig.reduce((acc, pageFilter) => {
        return {
          ...acc,
          ...pageFilter.getValue(emptyQueryParamsObject),
        };
      }, {})
    );
  }, [pageFiltersConfig, pageQueryParamsConfig, setQueryParams]);

  return { resetAllFilters, activeFiltersCount, queryParams, setQueryParams };
}
