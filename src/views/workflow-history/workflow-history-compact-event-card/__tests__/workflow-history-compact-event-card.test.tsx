import React from 'react';

import { render, screen } from '@/test-utils/rtl';

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
});

function setup(props: Partial<Props>) {
  return render(
    <WorkflowHistoryCompactEventCard
      status="COMPLETED"
      label="test label"
      secondaryLabel="test secondaryLabel"
      {...props}
    />
  );
}
