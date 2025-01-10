import { type ModalProps } from 'baseui/modal';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { describeWorkflowResponse } from '../../__fixtures__/describe-workflow-response';
import { mockWorkflowPageActionsConfig } from '../../__fixtures__/workflow-actions-config';
import WorkflowPageActionsModal from '../workflow-page-actions-modal';

jest.mock('baseui/modal', () => ({
  ...jest.requireActual('baseui/modal'),
  Modal: ({ isOpen, children }: ModalProps) =>
    isOpen ? (
      <div aria-modal aria-label="dialog" role="dialog">
        {typeof children === 'function' ? children() : children}
      </div>
    ) : null,
}));

describe(WorkflowPageActionsModal.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the action as expected', async () => {
    setup({});

    expect(await screen.findAllByText('Mock cancel workflow')).toHaveLength(2);
    expect(
      screen.getByText('Mock cancel a workflow execution')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Mock cancel workflow' })
    ).toBeInTheDocument();
  });

  it('renders nothing if no action is passed', async () => {
    setup({ omitAction: true });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onClose when the Go Back button is pressed', async () => {
    const { user, mockOnClose } = setup({});

    const goBackButton = await screen.findByText('Go back');
    await user.click(goBackButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});

function setup({ omitAction }: { omitAction?: boolean }) {
  const user = userEvent.setup();
  const mockOnClose = jest.fn();

  render(
    <WorkflowPageActionsModal
      workflow={describeWorkflowResponse}
      action={omitAction ? undefined : mockWorkflowPageActionsConfig[0]}
      onClose={mockOnClose}
    />
  );

  return { user, mockOnClose };
}
