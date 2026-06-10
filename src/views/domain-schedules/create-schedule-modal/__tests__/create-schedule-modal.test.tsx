import { render, screen, userEvent } from '@/test-utils/rtl';

import CreateScheduleModal from '../create-schedule-modal';

describe('CreateScheduleModal', () => {
  it('renders dialog with main form fields when open', () => {
    setup({ isOpen: true });

    expect(
      screen.getByRole('textbox', { name: 'Task List' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: 'Task Start-to-Close Timeout' })
    ).toBeInTheDocument();
  });

  it('does not render dialog when closed', () => {
    setup({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows client validation when required workflow fields are empty', async () => {
    const { user } = setup({ isOpen: true });

    await user.click(screen.getByRole('button', { name: 'Create schedule' }));

    expect(
      await screen.findByText('Workflow type is required')
    ).toBeInTheDocument();
    expect(screen.getByText('Task list is required')).toBeInTheDocument();
  });

  it('shows cron expression error when cron fields are cleared', async () => {
    const { user } = setup({ isOpen: true });

    for (const label of [
      'Minute',
      'Hour',
      'Day of Month',
      'Month',
      'Day of Week',
    ]) {
      const input = screen.getByLabelText(label);
      await user.clear(input);
    }

    await user.click(screen.getByRole('button', { name: 'Create schedule' }));

    expect(
      await screen.findByText('Cron expression is required')
    ).toBeInTheDocument();
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
