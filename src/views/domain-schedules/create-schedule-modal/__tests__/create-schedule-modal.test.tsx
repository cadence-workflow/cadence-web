import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type HttpEndpointMock } from '@/test-utils/msw-mock-handlers/msw-mock-handlers.types';

import CreateScheduleModal from '../create-schedule-modal';

const SCHEDULES_POST_PATH = '/api/domains/d1/c1/schedules';

const mockEnqueue = jest.fn();
const mockDequeue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: mockDequeue,
  }),
}));

describe('CreateScheduleModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('shows cron expression validation on change without submitting', async () => {
    const { user } = setup({ isOpen: true });

    await user.type(
      screen.getByRole('textbox', { name: 'Workflow Type' }),
      'DemoWorkflow'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Task List' }),
      'demo-task-list'
    );
    await fillRequiredTimeouts(user);

    const minuteInput = screen.getByLabelText('Minute');
    await user.type(minuteInput, '0');
    await user.clear(minuteInput);

    expect(
      await screen.findByText('Cron expression is required')
    ).toBeInTheDocument();
  });

  it('submits create schedule, enqueues success snackbar, and closes on success', async () => {
    const onClose = jest.fn();
    const { user } = setup({
      isOpen: true,
      onClose,
      endpointsMocks: [
        {
          path: SCHEDULES_POST_PATH,
          httpMethod: 'POST',
          mockOnce: true,
          httpResolver: async () => HttpResponse.json({ scheduleId: 'new-id' }),
        },
      ],
    });

    const workflowType = screen.getByRole('textbox', { name: 'Workflow Type' });
    const taskList = screen.getByRole('textbox', { name: 'Task List' });
    await user.type(workflowType, 'DemoWorkflow');
    await user.type(taskList, 'demo-task-list');
    await fillRequiredTimeouts(user);

    expect(workflowType).toHaveValue('DemoWorkflow');
    expect(taskList).toHaveValue('demo-task-list');

    await user.click(screen.getByRole('button', { name: 'Create schedule' }));

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Schedule created',
        })
      );
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an in-modal banner for non-validation server errors', async () => {
    const { user } = setup({
      isOpen: true,
      endpointsMocks: [
        {
          path: SCHEDULES_POST_PATH,
          httpMethod: 'POST',
          mockOnce: true,
          httpResolver: async () =>
            HttpResponse.json(
              { message: 'Schedule already exists' },
              { status: 409 }
            ),
        },
      ],
    });

    await user.type(
      screen.getByRole('textbox', { name: 'Workflow Type' }),
      'DemoWorkflow'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Task List' }),
      'demo-task-list'
    );
    await fillRequiredTimeouts(user);
    await user.click(screen.getByRole('button', { name: 'Create schedule' }));

    expect(
      await screen.findByText('Schedule already exists')
    ).toBeInTheDocument();
  });

  it('does not close until the create-schedule request completes', async () => {
    let releaseRequest: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      releaseRequest = resolve;
    });

    const onClose = jest.fn();
    const { user } = setup({
      isOpen: true,
      onClose,
      endpointsMocks: [
        {
          path: SCHEDULES_POST_PATH,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async () => {
            await gate;
            return HttpResponse.json({ scheduleId: 'new-id' });
          },
        },
      ],
    });

    await user.type(
      screen.getByRole('textbox', { name: 'Workflow Type' }),
      'DemoWorkflow'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Task List' }),
      'demo-task-list'
    );
    await fillRequiredTimeouts(user);
    await user.click(screen.getByRole('button', { name: 'Create schedule' }));

    expect(onClose).not.toHaveBeenCalled();

    releaseRequest?.();

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = jest.fn();
    const { user } = setup({ isOpen: true, onClose });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

async function fillRequiredTimeouts(
  user: ReturnType<typeof userEvent.setup>
): Promise<void> {
  await user.type(
    screen.getByRole('spinbutton', { name: 'Task Start-to-Close Timeout' }),
    '30'
  );
  await user.type(
    screen.getByRole('spinbutton', {
      name: 'Execution Start-to-Close Timeout',
    }),
    '3600'
  );
}

function setup({
  isOpen = true,
  onClose = jest.fn(),
  endpointsMocks,
}: {
  isOpen?: boolean;
  onClose?: jest.Mock;
  endpointsMocks?: Array<HttpEndpointMock>;
} = {}) {
  const user = userEvent.setup();

  render(
    <CreateScheduleModal
      domain="d1"
      cluster="c1"
      isOpen={isOpen}
      onClose={onClose}
    />,
    endpointsMocks ? { endpointsMocks } : undefined
  );

  return { user };
}
