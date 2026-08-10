import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import DomainBatchActionsSidebarItem from '../domain-batch-actions-sidebar-item';

describe(DomainBatchActionsSidebarItem.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the label and icon', () => {
    render(
      <DomainBatchActionsSidebarItem
        label="Batch action #5"
        icon={<div>Test Icon</div>}
        isSelected={false}
        isActive={false}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText('Batch action #5')).toBeInTheDocument();
    expect(screen.getByText('Test Icon')).toBeInTheDocument();
  });

  it('renders the sub label under the label when provided', () => {
    render(
      <DomainBatchActionsSidebarItem
        label="01 Jun, 12:00:00"
        subLabel="run-id-123"
        icon={null}
        isSelected={false}
        isActive={false}
        onSelect={jest.fn()}
      />
    );

    expect(screen.getByText('01 Jun, 12:00:00')).toBeInTheDocument();
    expect(screen.getByText('run-id-123')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();

    render(
      <DomainBatchActionsSidebarItem
        label="Batch action #5"
        icon={null}
        isSelected={false}
        isActive={false}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByText('Batch action #5'));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
