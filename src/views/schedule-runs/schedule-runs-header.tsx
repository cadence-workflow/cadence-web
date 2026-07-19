import { useState } from 'react';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import schedulePageQueryParamsConfig from '@/views/schedule-page/config/schedule-page-query-params.config';

import scheduleRunsFiltersConfig from './config/schedule-runs-filters.config';

export default function ScheduleRunsHeader() {
  const [areFiltersShown, setAreFiltersShown] = useState(false);
  const { resetAllFilters, activeFiltersCount, queryParams, setQueryParams } =
    usePageFilters({
      pageFiltersConfig: scheduleRunsFiltersConfig,
      pageQueryParamsConfig: schedulePageQueryParamsConfig,
    });

  return (
    <>
      <PageFiltersToggle
        isActive={areFiltersShown || activeFiltersCount > 0}
        onClick={() => setAreFiltersShown((value) => !value)}
        activeFiltersCount={activeFiltersCount}
      />
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
