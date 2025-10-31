import React from 'react';

import {
  mockIsIntersecting,
  intersectionMockInstance,
} from 'react-intersection-observer/test-utils';

import { act, render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryHeader from '../workflow-history-header';
import { type Props } from '../workflow-history-header.types';

jest.mock(
  '../../workflow-history-expand-all-events-button/workflow-history-expand-all-events-button',
  () =>
    jest.fn(({ isExpandAllEvents, toggleIsExpandAllEvents }) => (
      <button onClick={toggleIsExpandAllEvents}>
        {isExpandAllEvents ? 'Collapse All' : 'Expand All'}
      </button>
    ))
);

jest.mock(
  '../../workflow-history-export-json-button/workflow-history-export-json-button',
  () => jest.fn(() => <button>Export JSON</button>)
);

jest.mock(
  '@/components/page-filters/page-filters-toggle/page-filters-toggle',
  () =>
    jest.fn(({ onClick, isActive }) => (
      <button onClick={onClick}>
        {isActive ? 'Hide Filters' : 'Show Filters'}
      </button>
    ))
);

jest.mock(
  '@/components/page-filters/page-filters-fields/page-filters-fields',
  () =>
    jest.fn(() => <div data-testid="page-filters-fields">Filter Fields</div>)
);

jest.mock(
  '../../workflow-history-timeline-chart/workflow-history-timeline-chart',
  () =>
    jest.fn(() => (
      <div data-testid="workflow-history-timeline-chart">Timeline Chart</div>
    ))
);

describe(WorkflowHistoryHeader.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the header with title', () => {
    setup();
    expect(screen.getByText('Workflow history')).toBeInTheDocument();
  });

  it('should render expand all events button', () => {
    setup();
    expect(screen.getByText('Expand All')).toBeInTheDocument();
  });

  it('should render export JSON button', () => {
    setup();
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
  });

  it('should call toggleIsExpandAllEvents when expand button is clicked', async () => {
    const { user, mockToggleIsExpandAllEvents } = setup();
    const expandButton = screen.getByText('Expand All');

    await user.click(expandButton);

    expect(mockToggleIsExpandAllEvents).toHaveBeenCalledTimes(1);
  });

  it('should show "Ungroup" button in grouped view', () => {
    setup({ isUngroupedHistoryViewEnabled: false });
    expect(screen.getByText('Ungroup')).toBeInTheDocument();
  });

  it('should show "Group" button when in ungrouped view', () => {
    setup({ isUngroupedHistoryViewEnabled: true });
    expect(screen.getByText('Group')).toBeInTheDocument();
  });

  it('should call onClickGroupModeToggle when group/ungroup button is clicked', async () => {
    const { user, mockOnClickGroupModeToggle } = setup();
    const ungroupButton = screen.getByText('Ungroup');

    await user.click(ungroupButton);

    expect(mockOnClickGroupModeToggle).toHaveBeenCalledTimes(1);
  });

  it('should show filters by default', () => {
    setup();
    expect(screen.getByTestId('page-filters-fields')).toBeInTheDocument();
  });

  it('should toggle filters visibility when filter toggle is clicked', async () => {
    const { user } = setup();

    // Filters shown by default
    expect(screen.getByTestId('page-filters-fields')).toBeInTheDocument();

    const filterToggle = screen.getByText('Hide Filters');
    await user.click(filterToggle);

    // Filters should be hidden
    expect(screen.queryByTestId('page-filters-fields')).not.toBeInTheDocument();
  });

  it('should show Timeline button with secondary kind by default', () => {
    setup();
    const timelineButton = screen.getByText('Timeline');
    expect(timelineButton).toBeInTheDocument();
  });

  it('should not show timeline chart by default', () => {
    setup();
    expect(
      screen.queryByTestId('workflow-history-timeline-chart')
    ).not.toBeInTheDocument();
  });

  it('should toggle timeline chart visibility when Timeline button is clicked', async () => {
    const mockTimelineChartProps = {
      eventGroupsEntries: [],
      selectedEventId: 'event-1',
      isLoading: false,
      hasMoreEvents: false,
      isFetchingMoreEvents: false,
      fetchMoreEvents: jest.fn(),
      onClickEventGroup: jest.fn(),
    };

    const { user } = setup({
      pageFiltersProps: {
        activeFiltersCount: 0,
        queryParams: {
          historyEventTypes: undefined,
          historyEventStatuses: undefined,
          historySelectedEventId: undefined,
          ungroupedHistoryViewEnabled: undefined,
        },
        setQueryParams: jest.fn(),
        resetAllFilters: jest.fn(),
      },
      timelineChartProps: mockTimelineChartProps,
    });

    expect(
      screen.queryByTestId('workflow-history-timeline-chart')
    ).not.toBeInTheDocument();

    const timelineButton = screen.getByText('Timeline');
    await user.click(timelineButton);

    expect(
      screen.getByTestId('workflow-history-timeline-chart')
    ).toBeInTheDocument();
  });

  it('should set up intersection observer when sticky is enabled', () => {
    setup({ isStickyEnabled: true });

    const sentinel = screen.getByTestId('sentinel');
    expect(sentinel).toBeInTheDocument();

    const instance = intersectionMockInstance(sentinel);
    expect(instance.observe).toHaveBeenCalledWith(sentinel);
  });

  it('should render sentinel when sticky is enabled', () => {
    setup({ isStickyEnabled: true });

    const sentinel = screen.getByTestId('sentinel');
    expect(sentinel).toBeInTheDocument();
  });

  it('should not render sentinel when sticky is disabled', () => {
    setup({ isStickyEnabled: false });

    const sentinel = screen.queryByTestId('sentinel');
    expect(sentinel).not.toBeInTheDocument();
  });

  it('should toggle shadow on toggling intersection', () => {
    setup({ isStickyEnabled: true });

    const wrapper = screen.getByTestId('workflow-history-header-wrapper');
    const sentinel = screen.getByTestId('sentinel');

    expect(wrapper).toHaveAttribute('data-is-sticky', 'false');

    act(() => {
      mockIsIntersecting(sentinel, 0);
    });

    expect(wrapper).toHaveAttribute('data-is-sticky', 'true');

    act(() => {
      mockIsIntersecting(sentinel, 1);
    });

    expect(wrapper).toHaveAttribute('data-is-sticky', 'false');
  });
});

function setup(props: Partial<Props> = {}) {
  const user = userEvent.setup();
  const mockToggleIsExpandAllEvents = jest.fn();
  const mockOnClickGroupModeToggle = jest.fn();

  const defaultProps: Props = {
    isExpandAllEvents: false,
    toggleIsExpandAllEvents: mockToggleIsExpandAllEvents,
    isUngroupedHistoryViewEnabled: false,
    onClickGroupModeToggle: mockOnClickGroupModeToggle,
    wfHistoryRequestArgs: {
      domain: 'test-domain',
      cluster: 'test-cluster',
      workflowId: 'test-workflowId',
      runId: 'test-runId',
      pageSize: 100,
      waitForNewEvent: 'true',
    },
    pageFiltersProps: {
      activeFiltersCount: 0,
      queryParams: {
        historyEventTypes: undefined,
        historyEventStatuses: undefined,
        historySelectedEventId: undefined,
        ungroupedHistoryViewEnabled: undefined,
      },
      setQueryParams: jest.fn(),
      resetAllFilters: jest.fn(),
    },
    timelineChartProps: {
      eventGroupsEntries: [],
      selectedEventId: 'event-1',
      isLoading: false,
      hasMoreEvents: false,
      isFetchingMoreEvents: false,
      fetchMoreEvents: jest.fn(),
      onClickEventGroup: jest.fn(),
    },
    ...props,
  };

  const renderResult = render(<WorkflowHistoryHeader {...defaultProps} />);

  return {
    user,
    mockToggleIsExpandAllEvents,
    mockOnClickGroupModeToggle,
    ...renderResult,
  };
}
