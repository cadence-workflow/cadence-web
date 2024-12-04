import React, { useState } from 'react';

import {
  type PageQueryParams,
  type PageQueryParamKeys,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

import usePageFilters from './hooks/use-page-filters';
import PageFiltersFields from './page-filters-fields/page-filters-fields';
import PageFiltersSearch from './page-filters-search/page-filters-search';
import PageFiltersToggle from './page-filters-toggle/page-filters-toggle';
import { styled } from './page-filters.styles';
import { type Props } from './page-filters.types';

export default function PageFilters<
  P extends PageQueryParams,
  K extends PageQueryParamKeys<P>,
>({
  pageFiltersConfig,
  pageQueryParamsConfig,
  ...restSearchProps
}: Props<P, K>) {
  const [areFiltersShown, setAreFiltersShown] = useState(false);

  const { resetAllFilters, activeFiltersCount, queryParams, setQueryParams } =
    usePageFilters<P>({ pageFiltersConfig, pageQueryParamsConfig });

  return (
    <>
      <styled.SearchInputContainer>
        <PageFiltersSearch
          pageQueryParamsConfig={pageQueryParamsConfig}
          {...restSearchProps}
        />
        <PageFiltersToggle
          isActive={areFiltersShown}
          onClick={() => {
            setAreFiltersShown((value) => !value);
          }}
          activeFiltersCount={activeFiltersCount}
        />
      </styled.SearchInputContainer>
      {areFiltersShown && (
        <PageFiltersFields
          pageFiltersConfig={pageFiltersConfig}
          resetAllFilters={resetAllFilters}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
      )}
    </>
  );
}
