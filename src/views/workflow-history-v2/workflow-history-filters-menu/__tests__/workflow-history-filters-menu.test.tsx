import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryFiltersMenu from '../workflow-history-filters-menu';
import { type Props } from '../workflow-history-filters-menu.types';

jest.mock('../../config/workflow-history-filters.config', () => ({
  __esModule: true,
  default: [
    {
      id: 'historyEventTypes',
      getValue: (v: any) => ({ historyEventTypes: v.historyEventTypes }),
      formatValue: (v: any) => v,
      component: ({ value, setValue }: any) => (
        <div data-testid="filter-type">
          <div data-testid="filter-type-value">
            {value.historyEventTypes?.join(',') || 'empty'}
          </div>
          <button
            data-testid="filter-type-change"
            onClick={() =>
              setValue({
                historyEventTypes: ['ACTIVITY'],
              })
            }
          >
            Change Type
          </button>
        </div>
      ),
      filterFunc: jest.fn(),
    },
    {
      id: 'historyEventStatuses',
      getValue: (v: any) => ({ historyEventStatuses: v.historyEventStatuses }),
      formatValue: (v: any) => v,
      component: ({ value, setValue }: any) => (
        <div data-testid="filter-status">
          <div data-testid="filter-status-value">
            {value.historyEventStatuses?.join(',') || 'empty'}
          </div>
          <button
            data-testid="filter-status-change"
            onClick={() =>
              setValue({
                historyEventStatuses: ['FAILED'],
              })
            }
          >
            Change Status
          </button>
        </div>
      ),
      filterFunc: jest.fn(),
    },
  ],
}));

describe(WorkflowHistoryFiltersMenu.name, () => {
  it('renders without errors', () => {
    setup();
    expect(screen.getByText('Filters (0)')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('displays filters count with icon', () => {
    setup({ activeFiltersCount: 5 });
    expect(screen.getByText('Filters (5)')).toBeInTheDocument();
  });

  it('displays reset button', () => {
    setup();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('calls resetAllFilters when reset button is clicked', async () => {
    const { user, mockResetAllFilters } = setup();
    const resetButton = screen.getByText('Reset');

    await user.click(resetButton);

    expect(mockResetAllFilters).toHaveBeenCalledTimes(1);
  });

  it('renders all filter components from config', () => {
    setup();
    expect(screen.getByTestId('filter-type')).toBeInTheDocument();
    expect(screen.getByTestId('filter-status')).toBeInTheDocument();
  });

  it('passes correct values to Type filter when queryParams has historyEventTypes', () => {
    setup({
      queryParams: {
        historyEventTypes: ['ACTIVITY', 'DECISION'],
        historyEventStatuses: undefined,
        historySelectedEventId: undefined,
        ungroupedHistoryViewEnabled: undefined,
      },
    });

    const typeFilterValue = screen.getByTestId('filter-type-value');
    expect(typeFilterValue).toHaveTextContent('ACTIVITY,DECISION');
  });

  it('passes empty value to Type filter when queryParams has no historyEventTypes', () => {
    setup({
      queryParams: {
        historyEventTypes: undefined,
        historyEventStatuses: undefined,
        historySelectedEventId: undefined,
        ungroupedHistoryViewEnabled: undefined,
      },
    });

    const typeFilterValue = screen.getByTestId('filter-type-value');
    expect(typeFilterValue).toHaveTextContent('empty');
  });

  it('passes correct values to Status filter when queryParams has historyEventStatuses', () => {
    setup({
      queryParams: {
        historyEventTypes: undefined,
        historyEventStatuses: ['FAILED', 'CANCELED'],
        historySelectedEventId: undefined,
        ungroupedHistoryViewEnabled: undefined,
      },
    });

    const statusFilterValue = screen.getByTestId('filter-status-value');
    expect(statusFilterValue).toHaveTextContent('FAILED,CANCELED');
  });

  it('passes empty value to Status filter when queryParams has no historyEventStatuses', () => {
    setup({
      queryParams: {
        historyEventTypes: undefined,
        historyEventStatuses: undefined,
        historySelectedEventId: undefined,
        ungroupedHistoryViewEnabled: undefined,
      },
    });

    const statusFilterValue = screen.getByTestId('filter-status-value');
    expect(statusFilterValue).toHaveTextContent('empty');
  });

  it('calls setQueryParams when Type filter setValue is called', async () => {
    const { user, mockSetQueryParams } = setup({
      queryParams: {
        historyEventTypes: undefined,
        historyEventStatuses: undefined,
        historySelectedEventId: undefined,
        ungroupedHistoryViewEnabled: undefined,
      },
    });

    const typeFilterChangeButton = screen.getByTestId('filter-type-change');
    await user.click(typeFilterChangeButton);

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      historyEventTypes: ['ACTIVITY'],
    });
  });

  it('calls setQueryParams when Status filter setValue is called', async () => {
    const { user, mockSetQueryParams } = setup({
      queryParams: {
        historyEventTypes: undefined,
        historyEventStatuses: undefined,
        historySelectedEventId: undefined,
        ungroupedHistoryViewEnabled: undefined,
      },
    });

    const statusFilterChangeButton = screen.getByTestId('filter-status-change');
    await user.click(statusFilterChangeButton);

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      historyEventStatuses: ['FAILED'],
    });
  });
});

function setup(props: Partial<Props> = {}) {
  const user = userEvent.setup();
  const mockResetAllFilters = jest.fn();
  const mockSetQueryParams = jest.fn();

  const defaultProps: Props = {
    activeFiltersCount: 0,
    resetAllFilters: mockResetAllFilters,
    queryParams: {
      historyEventTypes: undefined,
      historyEventStatuses: undefined,
      historySelectedEventId: undefined,
      ungroupedHistoryViewEnabled: undefined,
    },
    setQueryParams: mockSetQueryParams,
  };

  const mergedProps = {
    ...defaultProps,
    ...props,
  };

  render(<WorkflowHistoryFiltersMenu {...mergedProps} />);

  return {
    user,
    mockResetAllFilters,
    mockSetQueryParams,
  };
}
