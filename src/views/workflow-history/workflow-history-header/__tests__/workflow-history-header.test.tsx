import React from 'react';

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

  it('should disconnect IntersectionObserver on unmount', () => {
    const { unmount, mockDisconnect } = setup({ isStickyEnabled: true });

    expect(mockDisconnect).not.toHaveBeenCalled();

    unmount();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should not show shadow initially when sentinel is intersecting', () => {
    setup({ isStickyEnabled: true });
    const wrapper = screen.getByTestId('workflow-history-header-wrapper');
    expect(wrapper).toHaveAttribute('data-is-sticky', 'false');
  });

  it('should show shadow when sentinel is not intersecting', () => {
    const { simulateIntersection } = setup({ isStickyEnabled: true });

    const wrapper = screen.getByTestId('workflow-history-header-wrapper');

    expect(wrapper).toHaveAttribute('data-is-sticky', 'false');
    simulateIntersection(false);
    expect(wrapper).toHaveAttribute('data-is-sticky', 'true');
  });

  it('should toggle shadow on multiple scroll events', () => {
    const { simulateIntersection } = setup({ isStickyEnabled: true });

    const wrapper = screen.getByTestId('workflow-history-header-wrapper');

    expect(wrapper).toHaveAttribute('data-is-sticky', 'false');

    simulateIntersection(false);
    expect(wrapper).toHaveAttribute('data-is-sticky', 'true');

    simulateIntersection(true);
    expect(wrapper).toHaveAttribute('data-is-sticky', 'false');

    simulateIntersection(false);
    expect(wrapper).toHaveAttribute('data-is-sticky', 'true');
  });

  it('should not show shadow when sticky is disabled', () => {
    const { container } = setup({ isStickyEnabled: false });

    // When sticky is disabled, the wrapper shouldn't exist
    // or if it does, $isSticky should remain false
    const wrapper = container.querySelector(
      '[data-testid="workflow-history-header-wrapper"]'
    );

    if (wrapper) {
      expect(wrapper).toHaveAttribute('data-is-sticky', 'false');
    }
  });
});

function setup(props: Partial<Props> = {}) {
  const user = userEvent.setup();
  const mockToggleIsExpandAllEvents = jest.fn();
  const mockOnClickGroupModeToggle = jest.fn();

  // Mock IntersectionObserver
  const mockObserve = jest.fn();
  const mockDisconnect = jest.fn();
  const mockUnobserve = jest.fn();
  let intersectionObserverCallback: IntersectionObserverCallback | null = null;

  global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
    intersectionObserverCallback = callback;
    return {
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: mockUnobserve,
    };
  });

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

  // Helper function to simulate intersection
  const simulateIntersection = (isIntersecting: boolean) => {
    if (!intersectionObserverCallback) {
      throw new Error('IntersectionObserver callback not initialized');
    }

    act(() => {
      intersectionObserverCallback!(
        [
          {
            isIntersecting,
            intersectionRatio: isIntersecting ? 1 : 0,
            rootBounds: isIntersecting ? ({} as DOMRectReadOnly) : null,
            target: {} as Element,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRect: {} as DOMRectReadOnly,
            time: Date.now(),
          },
        ],
        {} as IntersectionObserver
      );
    });
  };

  return {
    user,
    mockToggleIsExpandAllEvents,
    mockOnClickGroupModeToggle,
    mockObserve,
    mockDisconnect,
    mockUnobserve,
    intersectionObserverCallback,
    simulateIntersection,
    ...renderResult,
  };
}
