import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import ErrorPanel from '@/components/error-panel/error-panel';

import DomainBatchActionsNoActionsPlaceholder from '../domain-batch-actions-no-actions-placeholder';

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(
    ({
      message,
      actions,
    }: {
      message: string;
      actions?: Array<{ kind: string; label: string; onClick?: () => void }>;
    }) => (
      <div>
        {message}
        {actions?.map((action) => (
          <button key={action.label} onClick={action.onClick}>
            {action.label}
          </button>
        ))}
      </div>
    )
  )
);

describe(DomainBatchActionsNoActionsPlaceholder.name, () => {
  it('renders the message via ErrorPanel', () => {
    setup({});

    expect(screen.getByText('No batch actions found')).toBeInTheDocument();
  });

  it('passes the correct description to ErrorPanel', () => {
    setup({});

    expect(ErrorPanel).toHaveBeenCalledWith(
      expect.objectContaining({
        description: expect.stringContaining(
          'Click the button below to get started'
        ),
      }),
      {}
    );
  });

  it('passes a single callback action labeled "New batch action"', () => {
    setup({});

    expect(
      screen.getByRole('button', { name: 'New batch action' })
    ).toBeInTheDocument();
  });

  it('invokes onCreateNew when the action callback is triggered', async () => {
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
