import { render, screen, userEvent } from '@/test-utils/rtl';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';

import ScheduleRunsHeader from '../schedule-runs-header';

const mockUsePageFilters = jest.mocked(usePageFilters);

jest.mock('@/components/page-filters/hooks/use-page-filters');
jest.mock(
  '@/components/page-filters/page-filters-toggle/page-filters-toggle',
  () => jest.fn(({ onClick }) => <button onClick={onClick}>Filters</button>)
);
jest.mock(
  '@/components/page-filters/page-filters-fields/page-filters-fields',
  () => jest.fn(() => <div>Schedule time filter</div>)
);

describe(ScheduleRunsHeader.name, () => {
  it('toggles the collapsible filter panel', async () => {
    const user = userEvent.setup();
    mockUsePageFilters.mockReturnValue({
      resetAllFilters: jest.fn(),
      activeFiltersCount: 0,
      queryParams: {},
      setQueryParams: jest.fn(),
    });
    render(<ScheduleRunsHeader />);

    expect(screen.queryByText('Schedule time filter')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(screen.getByText('Schedule time filter')).toBeInTheDocument();
  });
});
