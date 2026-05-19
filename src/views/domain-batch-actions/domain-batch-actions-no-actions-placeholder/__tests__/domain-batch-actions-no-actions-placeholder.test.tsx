import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';

import DomainBatchActionsNoActionsPlaceholder from '../domain-batch-actions-no-actions-placeholder';

jest.mock('@/components/error-panel/error-panel', () => ({
  __esModule: true,
  default: ({ message, description, actions }: ErrorPanelProps) => (
    <div>
      <h2>{message}</h2>
      <p>{description}</p>
      {actions?.map((action) => (
        <button
          key={action.label}
          onClick={() => {
            if (action.kind === 'callback') action.onClick();
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  ),
}));

describe(DomainBatchActionsNoActionsPlaceholder.name, () => {
  it('renders the empty-state heading and description', () => {
    setup({});

    expect(
      screen.getByRole('heading', { name: 'No batch actions found' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Click the button below to get started/)
    ).toBeInTheDocument();
  });

  it('invokes onCreateNew when the action button is clicked', async () => {
    const { user, onCreateNew } = setup({});

    await user.click(screen.getByRole('button', { name: 'New batch action' }));

    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });
});

function setup({ onCreateNew = jest.fn() }: { onCreateNew?: jest.Mock }) {
  const user = userEvent.setup();
  render(<DomainBatchActionsNoActionsPlaceholder onCreateNew={onCreateNew} />);
  return { user, onCreateNew };
}
