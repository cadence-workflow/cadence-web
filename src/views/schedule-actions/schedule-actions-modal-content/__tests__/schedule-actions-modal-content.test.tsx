import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { type PauseScheduleResponse } from '@/route-handlers/pause-schedule/pause-schedule.types';

import { mockScheduleActionsConfig } from '../../__fixtures__/schedule-actions-config';
import ScheduleActionsModalContent from '../schedule-actions-modal-content';

const mockScheduleParams = {
  domain: 'mock-domain',
  cluster: 'mock-cluster',
  scheduleId: 'mock-schedule-id',
};

const mockEnqueue = jest.fn();
const mockDequeue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: mockDequeue,
  }),
}));

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({ push: jest.fn() }),
}));

describe(ScheduleActionsModalContent.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders the modal content as expected', async () => {
    setup({});

    expect(await screen.findAllByText('Mock pause schedule')).toHaveLength(2);
    expect(screen.getByText('Mock pause banner message')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Mock pause schedule' })
    ).toBeInTheDocument();
  });

  it('calls onCloseModal when the Cancel button is clicked', async () => {
    const { user, mockOnClose } = setup({});

    await user.click(await screen.findByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls pause API, sends toast, and closes modal when confirmed', async () => {
    const { user, mockOnClose, getLatestRequestBody, waitForRequest } = setup(
      {}
    );

    await user.click(
      await screen.findByRole('button', { name: 'Mock pause schedule' })
    );

    await waitForRequest();
    expect(getLatestRequestBody()).toEqual({ reason: 'Mock pause reason' });

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Mock pause notification',
        })
      );
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays banner when the action fails', async () => {
    const { user, mockOnClose } = setup({ error: true });

    await user.click(
      await screen.findByRole('button', { name: 'Mock pause schedule' })
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to pause schedule')).toBeInTheDocument();
    });
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: 'start',
    });
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});

function setup({ error }: { error?: boolean }) {
  const user = userEvent.setup();
  const mockOnClose = jest.fn();
  let latestRequestBody: unknown = null;
  let requestPromiseResolve: (value: unknown) => void = () => undefined;
  const requestPromise = new Promise((resolve) => {
    requestPromiseResolve = resolve;
  });

  render(
    <ScheduleActionsModalContent
      action={mockScheduleActionsConfig[0]}
      params={{ ...mockScheduleParams }}
      onCloseModal={mockOnClose}
    />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/schedules/:scheduleId/:action',
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            const text = await request.text();
            latestRequestBody = text ? JSON.parse(text) : null;
            requestPromiseResolve(null);

            if (error) {
              return HttpResponse.json(
                { message: 'Failed to pause schedule' },
                { status: 500 }
              );
            }

            return HttpResponse.json({} satisfies PauseScheduleResponse);
          },
        },
      ],
    }
  );

  return {
    user,
    mockOnClose,
    getLatestRequestBody: () => latestRequestBody,
    waitForRequest: () => requestPromise,
  };
}
