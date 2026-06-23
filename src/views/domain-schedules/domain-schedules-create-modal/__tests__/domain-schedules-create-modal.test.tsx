import { type ModalProps } from 'baseui/modal';

import { render, screen } from '@/test-utils/rtl';

import DomainSchedulesCreateModal from '../domain-schedules-create-modal';

jest.mock('baseui/modal', () => ({
  ...jest.requireActual('baseui/modal'),
  Modal: ({ isOpen, children }: ModalProps) =>
    isOpen ? (
      <div aria-modal aria-label="dialog" role="dialog">
        {typeof children === 'function' ? children() : children}
      </div>
    ) : null,
}));

jest.mock(
  '../../domain-schedules-create-form/domain-schedules-create-form',
  () => jest.fn(() => <div>Create schedule form</div>)
);

describe(DomainSchedulesCreateModal.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the create schedule flow as expected', async () => {
    setup({ isOpen: true });

    expect(screen.getByText('Create Schedule')).toBeInTheDocument();
    expect(await screen.findByText('Create schedule form')).toBeInTheDocument();
  });

  it('renders nothing when the modal is closed', () => {
    setup({ isOpen: false });

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

function setup({ isOpen }: { isOpen: boolean }) {
  const mockOnClose = jest.fn();

  render(
    <DomainSchedulesCreateModal
      domain="d1"
      cluster="c1"
      isOpen={isOpen}
      onClose={mockOnClose}
    />
  );
}
