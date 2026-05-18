import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import CreateScheduleModal from '../create-schedule-modal';

describe('CreateScheduleModal', () => {
  it('renders dialog with placeholder copy when open', () => {
    setup({ isOpen: true });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText(/Schedule form will be added in the next change/i)
    ).toBeInTheDocument();
  });

  it('does not render dialog when closed', () => {
    setup({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps primary create action disabled (shell only)', () => {
    setup({ isOpen: true });

    expect(
      screen.getByRole('button', { name: 'Create schedule' })
    ).toBeDisabled();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = jest.fn();
    const { user } = setup({ isOpen: true, onClose });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

function setup({
  isOpen = true,
  onClose = jest.fn(),
}: {
  isOpen?: boolean;
  onClose?: jest.Mock;
} = {}) {
  const user = userEvent.setup();

  render(
    <CreateScheduleModal
      domain="d1"
      cluster="c1"
      isOpen={isOpen}
      onClose={onClose}
    />
  );

  return { user };
}
