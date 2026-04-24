import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import BatchActionsSidebarItem from '../batch-actions-sidebar-item';

describe(BatchActionsSidebarItem.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the label and icon', () => {
    render(
      <BatchActionsSidebarItem
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

  it('calls onSelect when clicked', async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();

    render(
      <BatchActionsSidebarItem
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
