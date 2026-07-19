import { render, screen } from '@/test-utils/rtl';

import { type Props as PageFiltersSearchProps } from '@/components/page-filters/page-filters-search/page-filters-search.types';
import { type PageQueryParams } from '@/hooks/use-page-query-params/use-page-query-params.types';

import ScheduleRunsHeader from '../schedule-runs-header';

jest.mock(
  '@/components/page-filters/page-filters-search/page-filters-search',
  () =>
    jest.fn(
      ({
        searchQueryParamKey,
        searchPlaceholder,
        inputDebounceDurationMs,
      }: PageFiltersSearchProps<PageQueryParams, string>) => (
        <div>
          {String(searchQueryParamKey)}|{searchPlaceholder}|
          {inputDebounceDurationMs}
        </div>
      )
    )
);

describe(ScheduleRunsHeader.name, () => {
  it('renders the debounced URL-backed search input', () => {
    render(<ScheduleRunsHeader />);

    expect(
      screen.getByText(
        'scheduleRunsSearch|Search for runs by Run ID, Workflow ID or Backfill ID|250'
      )
    ).toBeInTheDocument();
  });
});
