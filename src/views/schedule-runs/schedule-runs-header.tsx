import PageFiltersSearch from '@/components/page-filters/page-filters-search/page-filters-search';
import schedulePageQueryParamsConfig from '@/views/schedule-page/config/schedule-page-query-params.config';
import WORKFLOWS_SEARCH_DEBOUNCE_MS from '@/views/shared/workflows-header/config/workflows-search-debounce-ms.config';

export default function ScheduleRunsHeader() {
  return (
    <PageFiltersSearch
      pageQueryParamsConfig={schedulePageQueryParamsConfig}
      searchQueryParamKey="scheduleRunsSearch"
      searchPlaceholder="Search for runs by Run ID, Workflow ID or Backfill ID"
      inputDebounceDurationMs={WORKFLOWS_SEARCH_DEBOUNCE_MS}
    />
  );
}
