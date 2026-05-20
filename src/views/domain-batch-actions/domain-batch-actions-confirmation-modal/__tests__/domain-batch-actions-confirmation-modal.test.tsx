import { type Control } from 'react-hook-form';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type BatchActionConfirmableType } from '../../domain-batch-actions.types';
import DomainBatchActionsConfirmationModal from '../domain-batch-actions-confirmation-modal';

jest.mock(
  '@/views/workflow-actions/workflow-action-signal-form/workflow-action-signal-form',
  () =>
    function MockSignalForm({ control }: { control: Control<any> }) {
      return (
        <div data-testid="signal-form">
          <label>
            Signal Name
            <input {...control.register('signalName')} />
          </label>
        </div>
      );
    }
);

describe(DomainBatchActionsConfirmationModal.name, () => {
  it('does not render modal content when actionId is null', () => {
    setup({ actionId: null });

    expect(screen.queryByText('Cancel workflows')).not.toBeInTheDocument();
  });

  it('renders cancel modal with correct title and description', () => {
    setup({ actionId: 'cancel' });

    expect(screen.getByText('Cancel workflows')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Cancel running workflows by scheduling a cancellation request, giving them a chance to clean up.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByTestId('signal-form')).not.toBeInTheDocument();
  });

  it('renders terminate modal with correct title and description', () => {
    setup({ actionId: 'terminate' });

    expect(screen.getByText('Terminate workflows')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Terminate running workflows immediately. Please terminate only if you know what you are doing.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByTestId('signal-form')).not.toBeInTheDocument();
  });

  it('renders signal modal with form', () => {
    setup({ actionId: 'signal' });

    expect(screen.getByText('Signal workflows')).toBeInTheDocument();
    expect(screen.getByTestId('signal-form')).toBeInTheDocument();
  });

  it('displays the selection count in the banner', () => {
    setup({ actionId: 'cancel', selectedCount: 42 });

    expect(screen.getByText('42 workflows selected')).toBeInTheDocument();
  });

  it('calls onClose when Close button is clicked', async () => {
    const { user, mockOnClose } = setup({ actionId: 'terminate' });

    await user.click(screen.getByText('Close'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm with actionId for non-form actions', async () => {
    const { user, mockOnConfirm } = setup({ actionId: 'terminate' });

    await user.click(screen.getByText('Start Batch Action'));

    expect(mockOnConfirm).toHaveBeenCalledWith('terminate', undefined);
  });

  it('calls onConfirm with transformed submission data for form actions', async () => {
    const { user, mockOnConfirm } = setup({ actionId: 'signal' });

    await user.type(screen.getByLabelText('Signal Name'), 'my-signal');
    await user.click(screen.getByText('Start Batch Action'));

    expect(mockOnConfirm).toHaveBeenCalledWith('signal', {
      signalName: 'my-signal',
    });
  });

  it('does not call onConfirm for form actions when validation fails', async () => {
    const { user, mockOnConfirm } = setup({ actionId: 'signal' });

    await user.click(screen.getByText('Start Batch Action'));

    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('shows Start Batch Action as confirm button label', () => {
    setup({ actionId: 'signal' });

    expect(
      screen.getByRole('button', { name: 'Start Batch Action' })
    ).toBeInTheDocument();
  });
});

function setup({
  actionId = 'cancel' as BatchActionConfirmableType | null,
  selectedCount = 10,
} = {}) {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const user = userEvent.setup();

  render(
    <DomainBatchActionsConfirmationModal
      actionId={actionId}
      selectedCount={selectedCount}
      onClose={mockOnClose}
      onConfirm={mockOnConfirm}
    />
  );

  return { user, mockOnClose, mockOnConfirm };
}
