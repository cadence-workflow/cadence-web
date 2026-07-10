import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { MarkdownPageContext } from '../../../markdown-page-context';
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

  it('remains disabled when props are missing and no page context is provided', () => {
    setup({ propsOverrides: { domain: undefined, cluster: undefined } });

    expect(screen.getByRole('button', { name: 'Send Signal' })).toHaveAttribute(
      'disabled'
    );
  });

  it('is enabled and signals successfully using values inherited from page context', async () => {
    const { user, getLatestRequest } = setup({
      propsOverrides: {
        domain: undefined,
        cluster: undefined,
        workflowId: undefined,
        runId: undefined,
      },
      contextValue: {
        domain: 'context-domain',
        cluster: 'context-cluster',
        workflowId: 'context-workflow-id',
        runId: 'context-run-id',
      },
    });

    const button = screen.getByRole('button', { name: 'Send Signal' });
    expect(button).not.toHaveAttribute('disabled');

    await user.click(button);

    await waitFor(() => {
      expect(getLatestRequest()).toBe(
        '/api/domains/context-domain/context-cluster/workflows/context-workflow-id/context-run-id/signal'
      );
    });
  });

  it('prefers explicit props over page context values', async () => {
    const { user, getLatestRequest } = setup({
      contextValue: {
        domain: 'context-domain',
        cluster: 'context-cluster',
        workflowId: 'context-workflow-id',
        runId: 'context-run-id',
      },
    });

    const button = screen.getByRole('button', { name: 'Send Signal' });
    await user.click(button);

    await waitFor(() => {
      expect(getLatestRequest()).toBe(
        `/api/domains/${defaultProps.domain}/${defaultProps.cluster}/workflows/${defaultProps.workflowId}/${defaultProps.runId}/signal`
      );
    });
  });
});

function setup({
  error,
  propsOverrides,
  contextValue,
}: {
  error?: boolean;
  propsOverrides?: Partial<typeof defaultProps>;
  contextValue?: Partial<typeof defaultProps>;
}) {
  const user = userEvent.setup();
  let latestRequestPathname: string | undefined;

  render(
    <SignalButton {...defaultProps} {...propsOverrides} />,
    {
      endpointsMocks: [
        {
          path: SIGNAL_ENDPOINT,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            latestRequestPathname = new URL(request.url).pathname;
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
    },
    contextValue
      ? {
          wrapper: ({ children }) => (
            <MarkdownPageContext.Provider value={contextValue}>
              {children}
            </MarkdownPageContext.Provider>
          ),
        }
      : undefined
  );

  return {
    user,
    getLatestRequest: () => {
      if (!latestRequestPathname) {
        throw new Error('No request was captured yet');
      }
      return latestRequestPathname;
    },
  };
}
