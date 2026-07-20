import { useCallback, useEffect, useMemo, useState } from 'react';

import { Search } from 'baseui/icon';
import { Input } from 'baseui/input';
import debounce from 'lodash/debounce';

import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import { overrides } from '@/components/page-filters/page-filters-search/page-filters-search.styles';
import WORKFLOWS_SEARCH_DEBOUNCE_MS from '@/views/shared/workflows-header/config/workflows-search-debounce-ms.config';

import scheduleRunsFiltersConfig from './config/schedule-runs-filters.config';
import { styled } from './schedule-runs.styles';
import { type Props } from './schedule-runs-header.types';

export default function ScheduleRunsHeader({
  search,
  setSearch,
  queryParams,
  setQueryParams,
  resetAllFilters,
  activeFiltersCount,
}: Props) {
  const [areFiltersShown, setAreFiltersShown] = useState(false);
  const [inputState, setInputState] = useState(search);

  useEffect(() => {
    setInputState(search);
  }, [search]);

  const setSearchDebounced = useMemo(
    () => debounce(setSearch, WORKFLOWS_SEARCH_DEBOUNCE_MS),
    [setSearch]
  );

  const onSearchChange = useCallback(
    (value: string) => {
      const searchValue = value.replaceAll(/^\s+/g, '');
      setInputState(searchValue);
      setSearchDebounced(searchValue);
    },
    [setSearchDebounced]
  );

  return (
    <>
      <styled.HeaderToolbar>
        <styled.SearchSlot>
          <Input
            value={inputState}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search for runs by Run ID, Workflow ID or Backfill ID"
            startEnhancer={() => <Search />}
            clearable
            clearOnEscape
            overrides={overrides.searchInput}
          />
        </styled.SearchSlot>
        <PageFiltersToggle
          isActive={areFiltersShown || activeFiltersCount > 0}
          onClick={() => setAreFiltersShown((value) => !value)}
          activeFiltersCount={activeFiltersCount}
        />
      </styled.HeaderToolbar>
      {areFiltersShown && (
        <PageFiltersFields
          pageFiltersConfig={scheduleRunsFiltersConfig}
          resetAllFilters={resetAllFilters}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
      )}
    </>
  );
}
