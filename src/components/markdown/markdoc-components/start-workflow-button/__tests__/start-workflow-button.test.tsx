import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { MarkdownContext } from '../../../markdown-context-provider/markdown-context-provider';
import { type MarkdownContextType } from '../../../markdown-context-provider/markdown-context-provider.types';
import StartWorkflowButton from '../start-workflow-button';
import { type StartWorkflowButtonProps } from '../start-workflow-button.types';

const mockEnqueue = jest.fn();
jest.mock('baseui/snackbar', () => ({
  ...jest.requireActual('baseui/snackbar'),
  useSnackbar: () => ({
    enqueue: mockEnqueue,
    dequeue: jest.fn(),
  }),
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: mockPush,
  }),
}));

const START_ENDPOINT = '/api/domains/:domain/:cluster/workflows/start';

const defaultProps = {
  workflowType: 'TestWorkflow',
  label: 'Start Workflow',
  domain: 'test-domain',
  cluster: 'test-cluster',
  taskList: 'test-task-list',
} satisfies StartWorkflowButtonProps;

describe(StartWorkflowButton.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the button with the provided label', () => {
    setup({});

    expect(
      screen.getByRole('button', { name: 'Start Workflow' })
    ).toBeInTheDocument();
  });

  it('disables the button when required props are missing', () => {
    setup({ propsOverrides: { domain: undefined } });

    expect(
      screen.getByRole('button', { name: 'Start Workflow' })
    ).toHaveAttribute('disabled');
  });

  it('remains disabled when domain/cluster are missing and no markdown context is provided', () => {
    setup({ propsOverrides: { domain: undefined, cluster: undefined } });

    expect(
      screen.getByRole('button', { name: 'Start Workflow' })
    ).toHaveAttribute('disabled');
  });

  it('is enabled and starts successfully using domain/cluster inherited from markdown context', async () => {
    const { user, getLatestRequest } = setup({
      propsOverrides: { domain: undefined, cluster: undefined },
      contextValue: {
        domain: 'context-domain',
        cluster: 'context-cluster',
      },
    });

    const button = screen.getByRole('button', { name: 'Start Workflow' });
    expect(button).not.toHaveAttribute('disabled');

    await user.click(button);

    await waitFor(() => {
      expect(getLatestRequest()).toBe(
        '/api/domains/context-domain/context-cluster/workflows/start'
      );
    });
  });

  it('prefers explicit domain/cluster props over markdown context values', async () => {
    const { user, getLatestRequest } = setup({
      contextValue: {
        domain: 'context-domain',
        cluster: 'context-cluster',
      },
    });

    const button = screen.getByRole('button', { name: 'Start Workflow' });
    await user.click(button);

    await waitFor(() => {
      expect(getLatestRequest()).toBe(
        `/api/domains/${defaultProps.domain}/${defaultProps.cluster}/workflows/start`
      );
    });
  });

  it('shows a success snackbar with a "View" action that navigates to the new workflow run', async () => {
    const { user } = setup({
      result: { workflowId: 'new-workflow-id', runId: 'new-run-id' },
    });

    const button = screen.getByRole('button', { name: 'Start Workflow' });
    await user.click(button);

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Successfully started workflow "TestWorkflow"',
          actionMessage: 'View',
        })
      );
    });

    const { actionOnClick } = mockEnqueue.mock.calls[0][0];
    actionOnClick();

    expect(mockPush).toHaveBeenCalledWith(
      '/domains/test-domain/test-cluster/workflows/new-workflow-id/new-run-id/summary'
    );
  });

  it('shows an error snackbar on failure', async () => {
    const { user } = setup({ error: true });

    const button = screen.getByRole('button', { name: 'Start Workflow' });
    await user.click(button);

    await waitFor(() => {
      expect(mockEnqueue).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to start workflow',
          actionMessage: 'Dismiss',
        })
      );
    });
  });
});

function setup({
  error,
  result,
  propsOverrides,
  contextValue,
}: {
  error?: boolean;
  result?: { workflowId?: string; runId?: string };
  propsOverrides?: Partial<StartWorkflowButtonProps>;
  contextValue?: MarkdownContextType;
}) {
  const user = userEvent.setup();
  let latestRequestPathname: string | undefined;

  render(
    <StartWorkflowButton {...defaultProps} {...propsOverrides} />,
    {
      endpointsMocks: [
        {
          path: START_ENDPOINT,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            latestRequestPathname = new URL(request.url).pathname;
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to start workflow' },
                { status: 500 }
              );
            }
            return HttpResponse.json(result ?? {});
          },
        },
      ],
    },
    contextValue
      ? {
          wrapper: ({ children }) => (
            <MarkdownContext.Provider value={contextValue}>
              {children}
            </MarkdownContext.Provider>
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
