import { render, screen, userEvent } from '@/test-utils/rtl';

import { type BatchActionType } from '@/route-handlers/describe-batch-action/describe-batch-action.types';
import { signalWorkflowFormSchema } from '@/views/workflow-actions/workflow-action-signal-form/schemas/signal-workflow-form-schema';

import { type BatchActionModalConfig } from '../../domain-batch-actions.types';
import DomainBatchActionsConfirmationModal from '../domain-batch-actions-confirmation-modal';

const mockConfig: Partial<
  Record<BatchActionType, BatchActionModalConfig<any, any>>
> = {
  cancel: {
    title: 'Mock Cancel',
    description: 'Mock cancel desc',
    withForm: false,
  },
  terminate: {
    title: 'Mock Terminate',
    description: 'Mock terminate desc',
    withForm: false,
  },
  signal: {
    title: 'Mock Signal',
    description: 'Mock signal desc',
    withForm: true,
    form: function MockSignalForm({ control }: { control: any }) {
      return (
        <div data-testid="signal-form">
          <label>
            Signal Name
            <input {...control.register('signalName')} />
          </label>
        </div>
      );
    },
    formSchema: signalWorkflowFormSchema,
    transformFormDataToSubmission: (formData) => formData,
  },
};

describe(DomainBatchActionsConfirmationModal.name, () => {
  it('does not render modal content when actionId is null', () => {
    setup({ actionId: null });

    expect(screen.queryByText('Mock Cancel')).not.toBeInTheDocument();
  });

  it('renders cancel modal with correct title and description', () => {
    setup({ actionId: 'cancel' });

    expect(screen.getByText('Mock Cancel')).toBeInTheDocument();
    expect(screen.getByText('Mock cancel desc')).toBeInTheDocument();
    expect(screen.queryByTestId('signal-form')).not.toBeInTheDocument();
  });

  it('renders terminate modal with correct title and description', () => {
    setup({ actionId: 'terminate' });

    expect(screen.getByText('Mock Terminate')).toBeInTheDocument();
    expect(screen.getByText('Mock terminate desc')).toBeInTheDocument();
    expect(screen.queryByTestId('signal-form')).not.toBeInTheDocument();
  });

  it('renders signal modal with form', () => {
    setup({ actionId: 'signal' });

    expect(screen.getByText('Mock Signal')).toBeInTheDocument();
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

    expect(mockOnConfirm).toHaveBeenCalledWith({ actionId: 'terminate' });
  });

  it('calls onConfirm with transformed submission data for form actions', async () => {
    const { user, mockOnConfirm } = setup({ actionId: 'signal' });

    await user.type(screen.getByLabelText('Signal Name'), 'my-signal');
    await user.click(screen.getByText('Start Batch Action'));

    expect(mockOnConfirm).toHaveBeenCalledWith({
      actionId: 'signal',
      submissionData: { signalName: 'my-signal' },
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
  actionId = 'cancel' as BatchActionType | null,
  selectedCount = 10,
} = {}) {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();
  const user = userEvent.setup();

  render(
    <DomainBatchActionsConfirmationModal
      config={mockConfig}
      actionId={actionId}
      selectedCount={selectedCount}
      onClose={mockOnClose}
      onConfirm={mockOnConfirm}
    />
  );

  return { user, mockOnClose, mockOnConfirm };
}
