import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { startWorkflowExecutionEvent } from '../../__fixtures__/workflow-history-single-events';
import type WorkflowHistoryEventStatusBadge from '../../workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryEventsDurationBadge from '../../workflow-history-events-duration-badge/workflow-history-events-duration-badge';
import WorkflowHistoryCompactEventCard from '../workflow-history-compact-event-card';
import { type Props } from '../workflow-history-compact-event-card.types';

jest.mock<typeof WorkflowHistoryEventStatusBadge>(
  '../../workflow-history-event-status-badge/workflow-history-event-status-badge',
  () => jest.fn((props) => <div>{props.status}</div>)
);

jest.mock<typeof WorkflowHistoryEventsDurationBadge>(
  '../../workflow-history-events-duration-badge/workflow-history-events-duration-badge',
  () => jest.fn(() => <div>Duration Badge</div>)
);

jest.mock(
  '../../workflow-history-group-label/workflow-history-group-label',
  () => jest.fn((props) => <>{props.label}</>)
);

describe('WorkflowHistoryCompactEventCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label correctly', () => {
    setup({
      label: 'test label',
    });

    expect(screen.getByText('test label')).toBeInTheDocument();
  });

  it('renders skeleton instead of label if showLabelPlaceholder is true', () => {
    const { container } = setup({
      label: 'test label',
      showLabelPlaceholder: true,
    });

    expect(screen.queryByText('test label')).not.toBeInTheDocument();
    expect(container.querySelector('[testid="loader"]')).toBeInTheDocument();
  });

  it('renders badges correctly', () => {
    setup({
      badges: [{ content: 'test badge 1' }, { content: 'test badge 2' }],
    });

    expect(screen.getByText('test badge 1')).toBeInTheDocument();
    expect(screen.getByText('test badge 2')).toBeInTheDocument();
  });

  it('renders with correct status', () => {
    setup({
      status: 'ONGOING',
    });

    const badge = screen.getByText('ONGOING');
    expect(badge).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const { user, mockOnClick } = setup({
      label: 'test label',
    });

    const tile = screen.getByText('test label');

    await user.click(tile);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should render duration badge passing showOngoingOnly as true when startTimeMs is provided', () => {
    setup({
      startTimeMs: 1726652232190.7927,
    });
    expect(WorkflowHistoryEventsDurationBadge).toHaveBeenCalledWith(
      expect.objectContaining({
        showOngoingOnly: true,
      }),
      {}
    );
  });

  it('should not render duration badge when startTimeMs is not provided', () => {
    setup({
      startTimeMs: null,
    });
    expect(screen.queryByText('Duration Badge')).not.toBeInTheDocument();
  });
});

function setup(props: Partial<Props>) {
  const user = userEvent.setup();
  const mockOnClick = jest.fn();
  return {
    ...render(
      <WorkflowHistoryCompactEventCard
        statusReady
        status="COMPLETED"
        label="test label"
        onClick={mockOnClick}
        startTimeMs={null}
        closeTimeMs={null}
        events={[startWorkflowExecutionEvent]}
        workflowCloseTimeMs={null}
        workflowCloseStatus={null}
        workflowIsArchived={false}
        hasMissingEvents={false}
        {...props}
      />
    ),
    user,
    mockOnClick,
  };
}
