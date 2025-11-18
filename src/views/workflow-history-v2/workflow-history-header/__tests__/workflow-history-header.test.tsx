import React from 'react';

import {
  mockIsIntersecting,
  intersectionMockInstance,
} from 'react-intersection-observer/test-utils';

import { act, render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryHeader from '../workflow-history-header';
import { type Props } from '../workflow-history-header.types';

jest.mock(
  '@/views/workflow-history/workflow-history-export-json-button/workflow-history-export-json-button',
  () => jest.fn(() => <button>Export JSON</button>)
);

jest.mock(
  '@/components/page-filters/page-filters-toggle/page-filters-toggle',
  () =>
    jest.fn(({ onClick, isActive, activeFiltersCount }) => (
      <button onClick={onClick} data-testid="page-filters-toggle">
        {isActive ? 'Hide Filters' : 'Show Filters'} ({activeFiltersCount})
      </button>
    ))
);

describe(WorkflowHistoryHeader.name, () => {
  it('should render the header with title', () => {
    setup();
    expect(screen.getByText('Workflow history')).toBeInTheDocument();
  });

  it('should render export JSON button', () => {
    setup();
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
  });

  it('should render segmented control with grouped and ungrouped segments', () => {
    setup();
    expect(screen.getByText('Grouped')).toBeInTheDocument();
    expect(screen.getByText('Ungrouped')).toBeInTheDocument();
  });

  it('should call onClickGroupModeToggle when segmented control segment is clicked', async () => {
    const { user, mockOnClickGroupModeToggle } = setup();
    const groupedSegment = screen.getByText('Grouped');

    await user.click(groupedSegment);

    expect(mockOnClickGroupModeToggle).toHaveBeenCalledTimes(1);
  });

  it('should render filters toggle button', () => {
    setup();
    expect(screen.getByTestId('page-filters-toggle')).toBeInTheDocument();
  });

  it('should show filters toggle as inactive by default', () => {
    setup();
    const filtersToggle = screen.getByTestId('page-filters-toggle');
    expect(filtersToggle).toHaveTextContent('Show Filters (0)');
  });

  it('should toggle filters visibility when filter toggle is clicked', async () => {
    const { user } = setup();
    const filtersToggle = screen.getByTestId('page-filters-toggle');

    expect(filtersToggle).toHaveTextContent('Show Filters (0)');

    await user.click(filtersToggle);

    expect(filtersToggle).toHaveTextContent('Hide Filters (0)');

    await user.click(filtersToggle);

    expect(filtersToggle).toHaveTextContent('Show Filters (0)');
  });

  it('should display active filters count in filters toggle', () => {
    setup({
      pageFiltersProps: {
        activeFiltersCount: 3,
        queryParams: {
          historyEventTypes: undefined,
          historyEventStatuses: undefined,
          historySelectedEventId: undefined,
          ungroupedHistoryViewEnabled: undefined,
        },
        setQueryParams: jest.fn(),
        resetAllFilters: jest.fn(),
      },
    });
    const filtersToggle = screen.getByTestId('page-filters-toggle');
    expect(filtersToggle).toHaveTextContent('Show Filters (3)');
  });

  it('should render sentinel when sticky is enabled', () => {
    setup({ isStickyEnabled: true });
    expect(screen.getByTestId('sentinel')).toBeInTheDocument();
  });

  it('should not render sentinel when sticky is disabled', () => {
    setup({ isStickyEnabled: false });
    expect(screen.queryByTestId('sentinel')).not.toBeInTheDocument();
  });

  it('should set up intersection observer when sticky is enabled', () => {
    setup({ isStickyEnabled: true });

    const sentinel = screen.getByTestId('sentinel');
    const instance = intersectionMockInstance(sentinel);
    expect(instance.observe).toHaveBeenCalledWith(sentinel);
  });

  it('should not set up intersection observer when sticky is disabled', () => {
    setup({ isStickyEnabled: false });

    const sentinel = screen.queryByTestId('sentinel');
    expect(sentinel).not.toBeInTheDocument();
  });

  it('should set sticky state to false when sentinel is in view', () => {
    setup({ isStickyEnabled: true });

    const wrapper = screen.getByTestId('workflow-history-header-wrapper');
    const sentinel = screen.getByTestId('sentinel');

    expect(wrapper).toHaveAttribute('data-is-sticky', 'false');

    act(() => {
      mockIsIntersecting(sentinel, 1);
    });

    expect(wrapper).toHaveAttribute('data-is-sticky', 'false');
  });

  it('should set sticky state to true when sentinel is out of view', () => {
    setup({ isStickyEnabled: true });

    const wrapper = screen.getByTestId('workflow-history-header-wrapper');
    const sentinel = screen.getByTestId('sentinel');

    expect(wrapper).toHaveAttribute('data-is-sticky', 'false');

    act(() => {
      mockIsIntersecting(sentinel, 0);
    });

    expect(wrapper).toHaveAttribute('data-is-sticky', 'true');
  });

  it('should toggle sticky state when sentinel visibility changes', () => {
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

  it('should disable sticky when isStickyEnabled changes to false', () => {
    const { rerender } = setup({ isStickyEnabled: true });

    const wrapper = screen.getByTestId('workflow-history-header-wrapper');
    const sentinel = screen.getByTestId('sentinel');

    act(() => {
      mockIsIntersecting(sentinel, 0);
    });

    expect(wrapper).toHaveAttribute('data-is-sticky', 'true');

    rerender(
      <WorkflowHistoryHeader {...getDefaultProps()} isStickyEnabled={false} />
    );

    expect(screen.queryByTestId('sentinel')).not.toBeInTheDocument();
    const newWrapper = screen.getByTestId('workflow-history-header-wrapper');
    expect(newWrapper).toHaveAttribute('data-is-sticky', 'false');
  });
});

function setup(props: Partial<Props> = {}) {
  const user = userEvent.setup();
  const mockOnClickGroupModeToggle = jest.fn();

  const defaultProps = getDefaultProps();
  const mergedProps = {
    ...defaultProps,
    onClickGroupModeToggle: mockOnClickGroupModeToggle,
    ...props,
  };

  const renderResult = render(<WorkflowHistoryHeader {...mergedProps} />);

  return {
    user,
    mockOnClickGroupModeToggle,
    ...renderResult,
  };
}

function getDefaultProps(): Props {
  return {
    isUngroupedHistoryViewEnabled: false,
    onClickGroupModeToggle: jest.fn(),
    wfHistoryRequestArgs: {
      domain: 'test-domain',
      cluster: 'test-cluster',
      workflowId: 'test-workflowId',
      runId: 'test-runId',
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
    isStickyEnabled: true,
  };
}
