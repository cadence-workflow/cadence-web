import React from 'react';

import { Button, KIND, SIZE } from 'baseui/button';
import { Delete } from 'baseui/icon';

import { type PageQueryParams } from '@/hooks/use-page-query-params/use-page-query-params.types';

import { styled, overrides } from './page-filters-fields.styles';
import { type Props } from './page-filters-fields.types';

export default function PageFiltersFields<P extends PageQueryParams>({
  pageFiltersConfig,
  resetAllFilters,
  queryParams,
  setQueryParams,
}: Props<P>) {
  return (
    <styled.SearchFiltersContainer>
      {pageFiltersConfig?.map((filter) => {
        return (
          <styled.SearchFilterContainer key={filter.id}>
            <filter.component
              value={filter.getValue(queryParams)}
              setValue={(newValue) =>
                setQueryParams(filter.formatValue(newValue))
              }
            />
          </styled.SearchFilterContainer>
        );
      })}
      <Button
        size={SIZE.compact}
        kind={KIND.tertiary}
        onClick={resetAllFilters}
        startEnhancer={Delete}
        overrides={overrides.clearFiltersButton}
      >
        Clear filters
      </Button>
    </styled.SearchFiltersContainer>
  );
}
