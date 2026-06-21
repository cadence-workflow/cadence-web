import { render, screen, userEvent } from '@/test-utils/rtl';

import DomainSchedulesCreateModal from '../domain-schedules-create-modal';

jest.mock(
  '@/views/domain-schedules/domain-schedules-create-form/domain-schedules-create-form',
  () => jest.fn(() => <div>DomainSchedulesCreateForm</div>)
);

describe('DomainSchedulesCreateModal', () => {
  it('renders dialog with form when open', () => {
    setup({ isOpen: true });
    expect(screen.getByText('DomainSchedulesCreateForm')).toBeInTheDocument();
  });

  it('does not render dialog when closed', () => {
    setup({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
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
    <DomainSchedulesCreateModal
      domain="d1"
      cluster="c1"
      isOpen={isOpen}
      onClose={onClose}
    />
  );

  return { user };
}
