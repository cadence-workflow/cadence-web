import { render, screen, userEvent } from '@/test-utils/rtl';

import ScheduleRunsHeader from '../schedule-runs-header';

describe(ScheduleRunsHeader.name, () => {
  it('debounces search updates', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const setSearch = jest.fn();

    render(
      <ScheduleRunsHeader
        search=""
        setSearch={setSearch}
        queryParams={{
          scheduleRunsSearch: '',
          scheduleRunsTimeStart: undefined,
          scheduleRunsTimeEnd: undefined,
          scheduleRunsStatuses: undefined,
          scheduleRunsRunType: 'all',
        }}
        setQueryParams={jest.fn()}
        resetAllFilters={jest.fn()}
        activeFiltersCount={0}
      />
    );

    await user.type(
      screen.getByPlaceholderText(
        'Search for runs by Run ID, Workflow ID or Backfill ID'
      ),
      'run-id'
    );

    expect(setSearch).not.toHaveBeenCalled();
    jest.advanceTimersByTime(250);
    expect(setSearch).toHaveBeenCalledWith('run-id');
    jest.useRealTimers();
  });

  it('toggles the collapsible filter panel', async () => {
    const user = userEvent.setup();

    render(
      <ScheduleRunsHeader
        search=""
        setSearch={jest.fn()}
        queryParams={{
          scheduleRunsSearch: '',
          scheduleRunsTimeStart: undefined,
          scheduleRunsTimeEnd: undefined,
          scheduleRunsStatuses: undefined,
          scheduleRunsRunType: 'all',
        }}
        setQueryParams={jest.fn()}
        resetAllFilters={jest.fn()}
        activeFiltersCount={0}
      />
    );

    expect(
      screen.queryByText('Workflow status', { selector: 'label' })
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /filter/i }));
    expect(
      screen.getByText('Workflow status', { selector: 'label' })
    ).toBeInTheDocument();
  });
});
