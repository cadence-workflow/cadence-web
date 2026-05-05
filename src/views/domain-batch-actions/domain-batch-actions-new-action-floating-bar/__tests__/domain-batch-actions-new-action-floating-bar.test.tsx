import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainBatchActionsNewActionFloatingBar from '../domain-batch-actions-new-action-floating-bar';
import { type DomainBatchActionsNewActionFloatingBarActionConfig } from '../domain-batch-actions-new-action-floating-bar.types';

function MockIcon() {
  return <span data-testid="mock-icon" />;
}

const mockActions: DomainBatchActionsNewActionFloatingBarActionConfig[] = [
  { id: 'cancel', label: 'Cancel', icon: MockIcon },
  { id: 'terminate', label: 'Terminate', icon: MockIcon },
  { id: 'signal', label: 'Signal', icon: MockIcon },
];

describe(DomainBatchActionsNewActionFloatingBar.name, () => {
  it('renders the selection summary text', () => {
    setup({ selectedCount: 5, totalCount: 32 });

    expect(screen.getByText('5 of 32 workflows included')).toBeInTheDocument();
  });

  it('renders one button per action', () => {
    setup({});

    expect(screen.getByRole('button', { name: /Cancel/ })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Terminate/ })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Signal/ })).toBeInTheDocument();
  });

  it('calls onActionClick with the action id when a button is clicked', async () => {
    const { user, onActionClick } = setup({});

    await user.click(screen.getByRole('button', { name: /Terminate/ }));

    expect(onActionClick).toHaveBeenCalledTimes(1);
    expect(onActionClick).toHaveBeenCalledWith('terminate');
  });

  it('renders no buttons when actions is empty', () => {
    setup({ actions: [] });

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

function setup({
  selectedCount = 32,
  totalCount = 32,
  actions = mockActions,
}: {
  selectedCount?: number;
  totalCount?: number;
  actions?: DomainBatchActionsNewActionFloatingBarActionConfig[];
}) {
  const onActionClick = jest.fn();
  const user = userEvent.setup();

  render(
    <DomainBatchActionsNewActionFloatingBar
      selectedCount={selectedCount}
      totalCount={totalCount}
      actions={actions}
      onActionClick={onActionClick}
    />
  );

  return { user, onActionClick };
}
