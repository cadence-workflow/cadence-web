import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';

import WorkflowHistoryFiltersMenu from '../workflow-history-filters-menu';
import { type Props } from '../workflow-history-filters-menu.types';

jest.mock('../../config/workflow-history-filters.config', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const useConfigValue =
    require('@/hooks/use-config-value/use-config-value').default;

  return {
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
        getValue: (v: any) => ({
          historyEventStatuses: v.historyEventStatuses,
        }),
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
      {
        id: 'historyEventIssues',
        getValue: (v: any) => ({ historyEventIssues: v.historyEventIssues }),
        formatValue: (v: any) => ({
          historyEventIssues: v.historyEventIssues ? 'true' : undefined,
        }),
        component: function MockIssuesFilter({ value, setValue }: any) {
          const { data: isDiagnosticsInHistoryEnabled } = useConfigValue(
            'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'
          );
          if (!isDiagnosticsInHistoryEnabled) return null;
          return (
            <label>
              <input
                type="checkbox"
                role="switch"
                aria-label="Only show events with issues"
                checked={value.historyEventIssues ?? false}
                onChange={(e: any) =>
                  setValue({
                    historyEventIssues: e.target.checked || undefined,
                  })
                }
              />
              Only show events with issues
            </label>
          );
        },
        filterFunc: () => true,
      },
    ],
  };
});

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
        historyEventIssues: undefined,
        selectedQueryName: undefined,
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
        historyEventIssues: undefined,
        selectedQueryName: undefined,
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
        historyEventIssues: undefined,
        selectedQueryName: undefined,
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
        historyEventIssues: undefined,
        selectedQueryName: undefined,
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
        historyEventIssues: undefined,
        selectedQueryName: undefined,
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
        historyEventIssues: undefined,
        selectedQueryName: undefined,
      },
    });

    const statusFilterChangeButton = screen.getByTestId('filter-status-change');
    await user.click(statusFilterChangeButton);

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      historyEventStatuses: ['FAILED'],
    });
  });

  it('renders the issues toggle when diagnostics in history is enabled', async () => {
    setup({}, { enableDiagnosticsInHistory: true });

    expect(
      await screen.findByRole('switch', {
        name: 'Only show events with issues',
      })
    ).toBeInTheDocument();
  });

  it('hides the issues toggle when diagnostics in history is disabled', async () => {
    setup({}, { enableDiagnosticsInHistory: false });

    await waitFor(() => {
      expect(screen.getByText('Filters (0)')).toBeInTheDocument();
    });
    expect(
      screen.queryByRole('switch', { name: 'Only show events with issues' })
    ).not.toBeInTheDocument();
  });

  it('calls setQueryParams with historyEventIssues true when the issues toggle is checked', async () => {
    const { user, mockSetQueryParams } = setup(
      {
        queryParams: {
          historyEventTypes: undefined,
          historyEventStatuses: undefined,
          historySelectedEventId: undefined,
          ungroupedHistoryViewEnabled: undefined,
          historyEventIssues: undefined,
          selectedQueryName: undefined,
        },
      },
      { enableDiagnosticsInHistory: true }
    );

    const toggle = await screen.findByRole('switch', {
      name: 'Only show events with issues',
    });
    await user.click(toggle);

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      historyEventIssues: 'true',
    });
  });

  it('calls setQueryParams with historyEventIssues undefined when the issues toggle is unchecked', async () => {
    const { user, mockSetQueryParams } = setup(
      {
        queryParams: {
          historyEventTypes: undefined,
          historyEventStatuses: undefined,
          historySelectedEventId: undefined,
          ungroupedHistoryViewEnabled: undefined,
          historyEventIssues: true,
          selectedQueryName: undefined,
        },
      },
      { enableDiagnosticsInHistory: true }
    );

    const toggle = await screen.findByRole('switch', {
      name: 'Only show events with issues',
    });
    await user.click(toggle);

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      historyEventIssues: undefined,
    });
  });
});

function setup(
  props: Partial<Props> = {},
  configOptions: { enableDiagnosticsInHistory?: boolean } = {}
) {
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
      historyEventIssues: undefined,
      selectedQueryName: undefined,
    },
    setQueryParams: mockSetQueryParams,
  };

  const mergedProps = {
    ...defaultProps,
    ...props,
  };

  render(<WorkflowHistoryFiltersMenu {...mergedProps} />, {
    endpointsMocks: [
      {
        path: '/api/config',
        httpMethod: 'GET',
        mockOnce: false,
        httpResolver: async () =>
          HttpResponse.json(
            (configOptions.enableDiagnosticsInHistory ??
              false) satisfies GetConfigResponse<'WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED'>
          ),
      },
    ],
  });

  return {
    user,
    mockResetAllFilters,
    mockSetQueryParams,
  };
}
