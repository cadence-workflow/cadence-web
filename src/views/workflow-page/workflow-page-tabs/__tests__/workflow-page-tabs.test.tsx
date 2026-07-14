import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, act, fireEvent } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import SnackbarProvider from '@/components/snackbar-provider/snackbar-provider';

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

  it('renders tabs titles correctly with diagnostics disabled', async () => {
    await setup({ enableDiagnostics: false });

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Queries')).toBeInTheDocument();
    expect(screen.getByText('Stack Trace')).toBeInTheDocument();
    expect(screen.queryByText('Diagnostics')).toBeNull();
  });

  it('renders tabs with diagnostics enabled', async () => {
    await setup({ enableDiagnostics: true });

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Queries')).toBeInTheDocument();
    expect(screen.getByText('Stack Trace')).toBeInTheDocument();
    expect(await screen.findByText('Diagnostics')).toBeInTheDocument();
  });

  it('renders tabs buttons correctly', async () => {
    await setup({ enableDiagnostics: false });

    expect(screen.getByText('CLI Commands')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders tabs artworks correctly with diagnostics disabled', async () => {
    await setup({ enableDiagnostics: false });

    expect(screen.getByTestId('summary-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('history-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('queries-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('stack-trace-artwork')).toBeInTheDocument();
    expect(screen.queryByTestId('diagnostics-artwork')).toBeNull();
  });

  it('renders tabs artworks correctly with diagnostics enabled', async () => {
    await setup({ enableDiagnostics: true });

    expect(screen.getByTestId('summary-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('history-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('queries-artwork')).toBeInTheDocument();
    expect(screen.getByTestId('stack-trace-artwork')).toBeInTheDocument();
    expect(
      await screen.findByTestId('diagnostics-artwork')
    ).toBeInTheDocument();
  });

  it('reroutes when new tab is clicked', async () => {
    await setup({ enableDiagnostics: false });

    const historyTab = await screen.findByText('History');
    act(() => {
      fireEvent.click(historyTab);
    });

    expect(mockPushFn).toHaveBeenCalledWith('history');
  });

  it('hides the diagnostics tab and shows an error snackbar when the resolver fails', async () => {
    await setup({ error: true });

    // Non-gated tabs still render — the tab bar is not torn down.
    expect(await screen.findByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();

    // Diagnostics is hidden and an error snackbar surfaces the failure.
    expect(screen.queryByText('Diagnostics')).toBeNull();
    expect(
      await screen.findByText('Failed to load Diagnostics tab')
    ).toBeInTheDocument();
  });
});

async function setup({
  error,
  enableDiagnostics,
}: {
  error?: boolean;
  enableDiagnostics?: boolean;
}) {
  render(
    <ErrorBoundary
      fallbackRender={({ error }) => <div>Error: {error.message}</div>}
    >
      <SnackbarProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <WorkflowPageTabs />
        </Suspense>
      </SnackbarProvider>
    </ErrorBoundary>,
    {
      endpointsMocks: [
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            if (error) {
              return HttpResponse.json(
                { message: 'Failed to fetch config' },
                { status: 500 }
              );
            } else {
              return HttpResponse.json(enableDiagnostics ?? false);
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
