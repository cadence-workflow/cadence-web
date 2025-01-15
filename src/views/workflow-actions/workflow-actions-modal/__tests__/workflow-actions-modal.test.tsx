import { type ModalProps } from 'baseui/modal';

import { render, screen } from '@/test-utils/rtl';

import { mockWorkflowActionsConfig } from '../../__fixtures__/workflow-actions-config';
import { mockWorkflowDetailsParams } from '../../__fixtures__/workflow-details-params';
import WorkflowActionsModal from '../workflow-actions-modal';

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
  '../../workflow-actions-modal-content/workflow-actions-modal-content',
  () => jest.fn(() => <div>Actions Modal Content</div>)
);

describe(WorkflowActionsModal.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the action as expected', async () => {
    setup({});

    expect(
      await screen.findByText('Actions Modal Content')
    ).toBeInTheDocument();
  });

  it('renders nothing if no action is passed', async () => {
    setup({ omitAction: true });

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

function setup({ omitAction }: { omitAction?: boolean }) {
  const mockOnClose = jest.fn();

  render(
    <WorkflowActionsModal
      {...mockWorkflowDetailsParams}
      action={omitAction ? undefined : mockWorkflowActionsConfig[0]}
      onClose={mockOnClose}
    />
  );
}
