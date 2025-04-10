import { HttpResponse } from 'msw';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type CancelWorkflowResponse } from '@/route-handlers/cancel-workflow/cancel-workflow.types';
import { mockWorkflowDetailsParams } from '@/views/workflow-page/__fixtures__/workflow-details-params';

import { mockWorkflowActionsConfig } from '../../__fixtures__/workflow-actions-config';
import { type WorkflowAction } from '../../workflow-actions.types';
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
      screen.getByText('Mock modal text to cancel a workflow execution')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Mock cancel workflow' })
    ).toBeInTheDocument();

    const docsLink = screen.getByText('Mock docs link');
    expect(docsLink).toHaveAttribute('href', 'https://mock.docs.link');
  });

  it('calls onCloseModal when the Cancel button is clicked', async () => {
    const { user, mockOnClose } = setup({});

    const cancelButton = await screen.findByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls mockCancelWorkflow, sends toast, and closes modal when the action button is clicked', async () => {
    const { user, mockOnClose } = setup({});

    const cancelButton = await screen.findByRole('button', {
      name: 'Mock cancel workflow',
    });
    await user.click(cancelButton);

    expect(mockEnqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Mock cancel notification',
      })
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('Displays banner when the action button is clicked and action fails', async () => {
    const { user, mockOnClose } = setup({ error: true });

    const cancelButton = await screen.findByRole('button', {
      name: 'Mock cancel workflow',
    });
    await user.click(cancelButton);

    expect(
      await screen.findByText('Failed to cancel workflow')
    ).toBeInTheDocument();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('renders array text correctly in modal content', () => {
    const cancelAction = {
      ...mockWorkflowActionsConfig[0],
      modal: {
        text: ['First line of array text', 'Second line of array text'],
      },
    };

    setup({ actionConfig: cancelAction });

    expect(screen.getByText('First line of array text')).toBeInTheDocument();
    expect(screen.getByText('Second line of array text')).toBeInTheDocument();
  });
});

function setup({
  error,
  actionConfig,
}: {
  error?: boolean;
  actionConfig?: WorkflowAction<any, any, any>;
}) {
  const user = userEvent.setup();
  const mockOnClose = jest.fn();

  render(
    <WorkflowActionsModalContent
      action={actionConfig ?? mockWorkflowActionsConfig[0]}
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

  return { user, mockOnClose };
}
