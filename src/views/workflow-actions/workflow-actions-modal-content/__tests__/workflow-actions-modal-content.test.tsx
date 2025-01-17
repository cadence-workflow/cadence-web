import { HttpResponse } from 'msw';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type CancelWorkflowResponse } from '@/route-handlers/cancel-workflow/cancel-workflow.types';
import { mockWorkflowDetailsParams } from '@/views/workflow-page/__fixtures__/workflow-details-params';

import { mockWorkflowActionsConfig } from '../../__fixtures__/workflow-actions-config';
import WorkflowActionsModalContent from '../workflow-actions-modal-content';

const mockEnqueue = jest.fn();
const mockDequeue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: mockDequeue,
  }),
}));

describe(WorkflowActionsModalContent.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal content as expected', async () => {
    setup({});

    expect(await screen.findAllByText('Mock cancel workflow')).toHaveLength(2);
    expect(
      screen.getByText('Mock cancel a workflow execution')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Mock cancel workflow' })
    ).toBeInTheDocument();
  });

  it('calls onCloseModal when the Go Back button is clicked', async () => {
    const { user, mockOnClose } = setup({});

    const goBackButton = await screen.findByText('Go back');
    await user.click(goBackButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls mockCancelWorkflow, sends toast, and closes modal when the action button is clicked', async () => {
    const { user, mockOnClose, mockCancelWorkflow } = setup({});

    const cancelButton = await screen.findByRole('button', {
      name: 'Mock cancel workflow',
    });
    await user.click(cancelButton);

    expect(mockCancelWorkflow).toHaveBeenCalled();
    expect(mockEnqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Mock cancel notification',
      })
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('Displays banner when the action button is clicked and action fails', async () => {
    const { user, mockOnClose, mockCancelWorkflow } = setup({ error: true });

    const cancelButton = await screen.findByRole('button', {
      name: 'Mock cancel workflow',
    });
    await user.click(cancelButton);

    expect(mockCancelWorkflow).toHaveBeenCalled();
    expect(
      await screen.findByText('Failed to cancel workflow')
    ).toBeInTheDocument();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});

function setup({ error }: { error?: boolean }) {
  const user = userEvent.setup();
  const mockOnClose = jest.fn();
  const mockCancelWorkflow = jest.fn();

  render(
    <WorkflowActionsModalContent
      action={mockWorkflowActionsConfig[0]}
      params={{ ...mockWorkflowDetailsParams }}
      onCloseModal={mockOnClose}
    />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/cancel',
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: () => {
            mockCancelWorkflow();
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to cancel workflow' },
                { status: 500 }
              );
            }
            return HttpResponse.json({} satisfies CancelWorkflowResponse);
          },
        },
      ],
    }
  );

  return { user, mockOnClose, mockCancelWorkflow };
}
