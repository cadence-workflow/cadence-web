import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import type WorkflowHistoryEventStatusBadge from '../../workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryCompactEventCard from '../workflow-history-compact-event-card';
import { type Props } from '../workflow-history-compact-event-card.types';

jest.mock<typeof WorkflowHistoryEventStatusBadge>(
  '../../workflow-history-event-status-badge/workflow-history-event-status-badge',
  () => jest.fn((props) => <div>{props.status}</div>)
);

describe('WorkflowHistoryCompactEventCard', () => {
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

  it('renders secondaryLabel correctly', () => {
    setup({
      secondaryLabel: 'date text',
    });
    expect(screen.getByText('date text')).toBeInTheDocument();
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
});

function setup(props: Partial<Props>) {
  const user = userEvent.setup();
  const mockOnClick = jest.fn();
  return {
    ...render(
      <WorkflowHistoryCompactEventCard
        status="COMPLETED"
        label="test label"
        secondaryLabel="test secondaryLabel"
        onClick={mockOnClick}
        {...props}
      />
    ),
    user,
    mockOnClick,
  };
}
