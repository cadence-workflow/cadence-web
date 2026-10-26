import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import WorkflowHome from '../workflow-home';
import { WORKFLOW_HOME_QUERY_NAME } from '../workflow-home.constants';

jest.mock('../workflow-home.constants', () => ({
  ...jest.requireActual('../workflow-home.constants'),
  WORKFLOW_HOME_QUERY_RETRY_DELAY_MS: 0,
  WORKFLOW_HOME_REFRESH_INTERVAL_MS: 50,
}));

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message, description, actions }) => (
    <div>
      <div>Mock ErrorPanel: {message}</div>
      <div>{description}</div>
      {actions?.map((action: { label: string; onClick: () => void }) => (
        <button key={action.label} onClick={action.onClick}>
          {action.label}
        </button>
      ))}
    </div>
  ))
);

jest.mock('../workflow-home-empty/workflow-home-empty', () =>
  jest.fn(() => <div>Mock Empty</div>)
);

const mockMarkdownProps = jest.fn();
jest.mock('@/views/shared/cadence-markdown/cadence-markdown', () =>
  jest.fn((props) => {
    mockMarkdownProps(props);
    return <div>Mock Markdown: {props.markdown}</div>;
  })
);

const params = {
  domain: 'd',
  cluster: 'c',
  workflowId: 'w',
  runId: 'r',
  workflowTab: 'summary',
} as const;

describe(WorkflowHome.name, () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the disabled state when the feature is off', async () => {
    await setup({ enabled: false });
    expect(
      await screen.findByText('Mock ErrorPanel: Home pages are not enabled')
    ).toBeInTheDocument();
  });

  it('renders the archived state for archived workflows', async () => {
    await setup({ archived: true });
    expect(
      await screen.findByText(
        'Mock ErrorPanel: Home pages are not available for archived workflows'
      )
    ).toBeInTheDocument();
  });

  it('renders the home page when the workflow has the query', async () => {
    await setup({});
    expect(
      await screen.findByText('Mock Markdown: # Home')
    ).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('renders the title as a heading', async () => {
    await setup({ title: 'Expense report 1' });
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Expense report 1' })
    ).toBeInTheDocument();
  });

  it('renders the empty state when the error lists the known query types', async () => {
    await setup({ notSetUp: true });
    expect(await screen.findByText('Mock Empty')).toBeInTheDocument();
    expect(screen.queryByText('Refresh')).toBeNull();
  });

  it('renders the error state when the query fails', async () => {
    await setup({ queryError: true });
    expect(
      await screen.findByText('Mock ErrorPanel: Could not load the home page')
    ).toBeInTheDocument();
  });

  it('refetches the home page query when Retry is clicked', async () => {
    const { user, getHomeQueryCalls } = await setup({
      queryError: true,
    });
    const retryButton = await screen.findByText('Retry');
    const callsBeforeRetry = getHomeQueryCalls();
    await user.click(retryButton);
    await waitFor(() =>
      expect(getHomeQueryCalls()).toBeGreaterThan(callsBeforeRetry)
    );
  });

  it('renders the invalid format state when the result is not a home page', async () => {
    await setup({ nonMarkdown: true });
    expect(
      await screen.findByText(
        'Mock ErrorPanel: The home page is not in a supported format'
      )
    ).toBeInTheDocument();
  });

  it('refetches the home page query when Refresh is clicked', async () => {
    const { user, getHomeQueryCalls } = await setup({});
    await screen.findByText('Mock Markdown: # Home');
    expect(getHomeQueryCalls()).toBe(1);
    await user.click(screen.getByText('Refresh'));
    await waitFor(() => expect(getHomeQueryCalls()).toBe(2));
  });

  it('refetches the home page query on action success, then again after a delay', async () => {
    const { getHomeQueryCalls } = await setup({});
    await screen.findByText('Mock Markdown: # Home');
    mockMarkdownProps.mock.calls[0][0].onActionSuccess();
    await waitFor(() => expect(getHomeQueryCalls()).toBe(2));
    await waitFor(() => expect(getHomeQueryCalls()).toBe(3), {
      timeout: 2000,
    });
  });

  it('polls the home page query while the workflow is running', async () => {
    const { getHomeQueryCalls } = await setup({ isRunning: true });
    await screen.findByText('Mock Markdown: # Home');
    await waitFor(() => expect(getHomeQueryCalls()).toBeGreaterThan(2));
  });

  it('does not poll the home page query when the workflow is closed', async () => {
    const { getHomeQueryCalls } = await setup({});
    await screen.findByText('Mock Markdown: # Home');
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(getHomeQueryCalls()).toBe(1);
  });
});

async function setup({
  enabled = true,
  queryError,
  notSetUp,
  archived,
  nonMarkdown,
  content = '# Home',
  title,
  isRunning = false,
}: {
  enabled?: boolean;
  queryError?: boolean;
  notSetUp?: boolean;
  archived?: boolean;
  nonMarkdown?: boolean;
  content?: string;
  title?: string;
  isRunning?: boolean;
}) {
  const user = userEvent.setup();
  let homeQueryCalls = 0;

  render(
    <Suspense fallback={<div>Loading...</div>}>
      <WorkflowHome params={params} />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: enabled,
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: isRunning
            ? {
                ...mockDescribeWorkflowResponse,
                workflowExecutionInfo: {
                  ...mockDescribeWorkflowResponse.workflowExecutionInfo,
                  closeStatus: null,
                  closeEvent: null,
                },
              }
            : archived
              ? {
                  ...mockDescribeWorkflowResponse,
                  workflowExecutionInfo: {
                    ...mockDescribeWorkflowResponse.workflowExecutionInfo,
                    isArchived: true,
                  },
                }
              : mockDescribeWorkflowResponse,
        },
        {
          path: `/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query/${WORKFLOW_HOME_QUERY_NAME}`,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async () => {
            homeQueryCalls++;
            if (notSetUp) {
              return HttpResponse.json(
                {
                  message:
                    'unknown queryType. KnownQueryTypes=[__stack_trace other]',
                },
                { status: 500 }
              );
            }
            if (queryError) {
              return HttpResponse.json({ message: 'nope' }, { status: 500 });
            }
            return HttpResponse.json({
              result: nonMarkdown
                ? { a: 1 }
                : {
                    cadenceResponseType: 'formattedData',
                    format: 'text/markdown',
                    data: content,
                    title,
                  },
              rejected: null,
            });
          },
        },
      ],
    }
  );

  return {
    user,
    getHomeQueryCalls: () => homeQueryCalls,
  };
}
