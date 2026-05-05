import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import SignalButton from '../signal-button';
import { SIGNAL_SUCCESS_NOTIFICATION_DURATION_MS } from '../signal-button.constants';

const mockEnqueue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: jest.fn(),
  }),
}));

const SIGNAL_ENDPOINT =
  '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/signal';

const defaultProps = {
  signalName: 'test-signal',
  label: 'Send Signal',
  domain: 'test-domain',
  cluster: 'test-cluster',
  workflowId: 'test-workflow-id',
  runId: 'test-run-id',
};

describe(SignalButton.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button with the provided label', () => {
    setup({});

    expect(
      screen.getByRole('button', { name: 'Send Signal' })
    ).toBeInTheDocument();
  });

  it('disables the button when required props are missing', () => {
    setup({ propsOverrides: { domain: undefined } });

    expect(screen.getByRole('button', { name: 'Send Signal' })).toHaveAttribute(
      'disabled'
    );
  });

  it('shows a success snackbar with auto-dismiss duration after signaling', async () => {
    const { user } = setup({});

    const button = screen.getByRole('button', { name: 'Send Signal' });
    await user.click(button);

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Successfully sent signal "test-signal"',
          actionMessage: 'OK',
        }),
        SIGNAL_SUCCESS_NOTIFICATION_DURATION_MS
      );
    });
  });

  it('shows an error snackbar without auto-dismiss duration on failure', async () => {
    const { user } = setup({ error: true });

    const button = screen.getByRole('button', { name: 'Send Signal' });
    await user.click(button);

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          actionMessage: 'Dismiss',
        })
      );
    });

    // Error snackbar should not pass a duration (uses provider default: infinite)
    expect(mockEnqueue).toHaveBeenCalledTimes(1);
    expect(mockEnqueue.mock.calls[0]).toHaveLength(1);
  });
});

function setup({
  error,
  propsOverrides,
}: {
  error?: boolean;
  propsOverrides?: Partial<typeof defaultProps>;
}) {
  const user = userEvent.setup();

  render(<SignalButton {...defaultProps} {...propsOverrides} />, {
    endpointsMocks: [
      {
        path: SIGNAL_ENDPOINT,
        httpMethod: 'POST',
        mockOnce: false,
        httpResolver: async () => {
          if (error) {
            return HttpResponse.json(
              { message: 'Failed to signal workflow' },
              { status: 500 }
            );
          }
          return HttpResponse.json({});
        },
      },
    ],
  });

  return { user };
}
