import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import * as usePageFiltersModule from '@/components/page-filters/hooks/use-page-filters';
import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { WorkflowHistoryContext } from '../../workflow-history/workflow-history-context-provider/workflow-history-context-provider';
import WorkflowHistoryV2 from '../workflow-history-v2';

jest.mock('@/components/page-filters/hooks/use-page-filters', () =>
  jest.fn().mockReturnValue({})
);

jest.mock('../workflow-history-header/workflow-history-header', () =>
  jest.fn(({ isUngroupedHistoryViewEnabled, onClickGroupModeToggle }) => (
    <div data-testid="workflow-history-header">
      <div data-testid="is-ungrouped-enabled">
        {String(isUngroupedHistoryViewEnabled)}
      </div>
      <button data-testid="toggle-group-mode" onClick={onClickGroupModeToggle}>
        Toggle Group Mode
      </button>
    </div>
  ))
);

jest.mock(
  '../workflow-history-grouped-table/workflow-history-grouped-table',
  () =>
    jest.fn(() => (
      <div data-testid="workflow-history-grouped-table">Grouped Table</div>
    ))
);

jest.mock('@/utils/decode-url-params', () => jest.fn((params) => params));

const mockSetQueryParams = jest.fn();
const mockResetAllFilters = jest.fn();
const mockSetUngroupedViewUserPreference = jest.fn();

describe(WorkflowHistoryV2.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render WorkflowHistoryHeader', () => {
    setup();
    expect(screen.getByTestId('workflow-history-header')).toBeInTheDocument();
  });

  it('should render grouped table by default when ungroupedHistoryViewEnabled is not set and user preference is false', () => {
    setup({ ungroupedViewUserPreference: false });
    expect(
      screen.getByTestId('workflow-history-grouped-table')
    ).toBeInTheDocument();
    expect(screen.queryByText('WIP: ungrouped table')).not.toBeInTheDocument();
  });

  it('should render grouped table by default when ungroupedHistoryViewEnabled is not set and user preference is null', () => {
    setup({ ungroupedViewUserPreference: null });
    expect(
      screen.getByTestId('workflow-history-grouped-table')
    ).toBeInTheDocument();
    expect(screen.queryByText('WIP: ungrouped table')).not.toBeInTheDocument();
  });

  it('should render ungrouped table when ungroupedHistoryViewEnabled query param is true', () => {
    setup({
      queryParams: {
        ungroupedHistoryViewEnabled: true,
      },
    });
    expect(screen.getByText('WIP: ungrouped table')).toBeInTheDocument();
    expect(
      screen.queryByTestId('workflow-history-grouped-table')
    ).not.toBeInTheDocument();
  });

  it('should render grouped table when ungroupedHistoryViewEnabled query param is false', () => {
    setup({
      queryParams: {
        ungroupedHistoryViewEnabled: false,
      },
    });
    expect(
      screen.getByTestId('workflow-history-grouped-table')
    ).toBeInTheDocument();
    expect(screen.queryByText('WIP: ungrouped table')).not.toBeInTheDocument();
  });

  it('should render ungrouped table when user preference is true and query param is not set', () => {
    setup({ ungroupedViewUserPreference: true });
    expect(screen.getByText('WIP: ungrouped table')).toBeInTheDocument();
    expect(
      screen.queryByTestId('workflow-history-grouped-table')
    ).not.toBeInTheDocument();
  });

  it('should call setUngroupedViewUserPreference and setQueryParams when toggle is clicked from grouped to ungrouped', async () => {
    const { user } = setup({
      queryParams: {
        ungroupedHistoryViewEnabled: false,
      },
    });

    const toggleButton = screen.getByTestId('toggle-group-mode');
    await user.click(toggleButton);

    expect(mockSetUngroupedViewUserPreference).toHaveBeenCalledWith(true);
    expect(mockSetQueryParams).toHaveBeenCalledWith({
      ungroupedHistoryViewEnabled: 'true',
    });
  });

  it('should call setUngroupedViewUserPreference and setQueryParams when toggle is clicked from ungrouped to grouped', async () => {
    const { user } = setup({
      queryParams: {
        ungroupedHistoryViewEnabled: true,
      },
    });

    const toggleButton = screen.getByTestId('toggle-group-mode');
    await user.click(toggleButton);

    expect(mockSetUngroupedViewUserPreference).toHaveBeenCalledWith(false);
    expect(mockSetQueryParams).toHaveBeenCalledWith({
      ungroupedHistoryViewEnabled: 'false',
    });
  });
});

function setup({
  params = {
    cluster: 'test-cluster',
    domain: 'test-domain',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
  },
  queryParams = {
    historyEventTypes: undefined,
    historyEventStatuses: undefined,
    historySelectedEventId: undefined,
    ungroupedHistoryViewEnabled: undefined,
  },
  ungroupedViewUserPreference = false,
}: {
  params?: WorkflowPageParams;
  queryParams?: {
    historyEventTypes?: unknown;
    historyEventStatuses?: unknown;
    historySelectedEventId?: unknown;
    ungroupedHistoryViewEnabled?: boolean;
    activeFiltersCount?: number;
  };
  ungroupedViewUserPreference?: boolean | null;
} = {}) {
  const user = userEvent.setup();

  jest.spyOn(usePageFiltersModule, 'default').mockReturnValue({
    resetAllFilters: mockResetAllFilters,
    activeFiltersCount: queryParams.activeFiltersCount ?? 0,
    queryParams: {
      historyEventTypes: queryParams.historyEventTypes,
      historyEventStatuses: queryParams.historyEventStatuses,
      historySelectedEventId: queryParams.historySelectedEventId,
      ungroupedHistoryViewEnabled: queryParams.ungroupedHistoryViewEnabled,
    },
    setQueryParams: mockSetQueryParams,
  });

  const mockContextValue = {
    ungroupedViewUserPreference,
    setUngroupedViewUserPreference: mockSetUngroupedViewUserPreference,
  };

  const renderResult = render(
    <WorkflowHistoryContext.Provider value={mockContextValue}>
      <WorkflowHistoryV2
        params={{
          ...params,
          workflowTab: 'history',
        }}
      />
    </WorkflowHistoryContext.Provider>
  );

  return {
    user,
    ...renderResult,
  };
}
