import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { type GetConfigResponse } from '@/route-handlers/get-config/get-config.types';

import { mockWorkflowPageTabsConfig } from '../../__fixtures__/workflow-page-tabs-config';
import WorkflowPageTabs from '../workflow-page-tabs';

const mockPushFn = jest.fn();
//TODO @assem.hafez  create testing util for router
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({
    push: mockPushFn,
    back: () => {},
    replace: () => {},
    forward: () => {},
    prefetch: () => {},
    refresh: () => {},
  }),
  useParams: () => ({
    cluster: 'example-cluster',
    domain: 'example-domain',
    runId: 'example-runId',
    workflowId: 'example-workflowId',
    workflowTab: 'summary',
  }),
}));

jest.mock(
  '../../config/workflow-page-tabs.config',
  () => mockWorkflowPageTabsConfig
);

jest.mock(
  '../../workflow-page-cli-commands-button/workflow-page-cli-commands-button',
  () => jest.fn(() => <div>CLI Commands</div>)
);

jest.mock('@/views/workflow-actions/workflow-actions', () =>
  jest.fn(() => <div>Actions</div>)
);

describe('WorkflowPageTabs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders tabs titles correctly', async () => {
    await setup({});

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Queries')).toBeInTheDocument();
    expect(screen.getByText('Stack Trace')).toBeInTheDocument();
  });

  it('renders the home page tab when the feature is enabled', async () => {
    await setup({ enableHome: true });

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByTestId('home-artwork')).toBeInTheDocument();
  });

  it('hides the home page tab when the feature is disabled', async () => {
    await setup({ enableHome: false });

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.queryByText('Home')).toBeNull();
    expect(screen.queryByTestId('home-artwork')).toBeNull();
  });

  it('renders tabs buttons correctly', async () => {
    await setup({});

    expect(screen.getByText('CLI Commands')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders tabs artworks correctly', async () => {
    await setup({});

    expect(screen.getByTestId('summary-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('history-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('queries-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('stack-trace-artwork')).toBeInTheDocument();
  });

  it('reroutes when new tab is clicked', async () => {
    await setup({});

    const historyTab = await screen.findByText('History');
    act(() => {
      fireEvent.click(historyTab);
    });

    expect(mockPushFn).toHaveBeenCalledWith('history');
  });

  it('handles errors gracefully', async () => {
    await setup({ error: true });

    expect(
      await screen.findByText('Error: Failed to fetch config')
    ).toBeInTheDocument();
  });
});

async function setup({
  error,
  enableHome,
}: {
  error?: boolean;
  enableHome?: boolean;
}) {
  render(
    <ErrorBoundary
      fallbackRender={({ error }) => <div>Error: {error.message}</div>}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <WorkflowPageTabs />
      </Suspense>
    </ErrorBoundary>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch config' },
                { status: 500 }
              );
            }

            const url = new URL(request.url);
            const configKey = url.searchParams.get('configKey');

            switch (configKey) {
              case 'WORKFLOW_HOME_ENABLED':
                return HttpResponse.json(
                  (enableHome ??
                    false) satisfies GetConfigResponse<'WORKFLOW_HOME_ENABLED'>
                );
              default:
                return HttpResponse.json(false);
            }
          },
        },
      ],
    }
  );

  if (!error) {
    // Wait for the first tab to load
    await screen.findByText('Summary');
  }
}
