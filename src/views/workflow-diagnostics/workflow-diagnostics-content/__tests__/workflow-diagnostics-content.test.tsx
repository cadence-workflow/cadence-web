import { HttpResponse } from 'msw';
import { ZodError } from 'zod';

import { render, screen, userEvent, within } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';
import { type DiagnoseWorkflowResponse } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

import WorkflowDiagnosticsContent from '../workflow-diagnostics-content';

jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div data-testid="loading-indicator">Loading...</div>)
);

jest.mock('../../workflow-diagnostics-list/workflow-diagnostics-list', () =>
  jest.fn(() => <div>Diagnostics List Component</div>)
);

jest.mock('../../workflow-diagnostics-json/workflow-diagnostics-json', () =>
  jest.fn(() => <div>Diagnostics JSON Component</div>)
);

describe('WorkflowDiagnosticsContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading indicator when status is pending', async () => {
    setup({ responseType: 'pending' });

    expect(await screen.findByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should throw error when status is error', async () => {
    setup({ responseType: 'error' });

    expect(
      await screen.findByText('Failed to fetch diagnostics')
    ).toBeInTheDocument();
  });

  it('should render diagnostics list view by default', async () => {
    setup({ responseType: 'success' });

    expect(
      await screen.findByText('Diagnostics List Component')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Diagnostics JSON Component')
    ).not.toBeInTheDocument();
  });

  it('should allow switching between list and JSON views', async () => {
    const { user } = setup({ responseType: 'success' });

    // Initially shows list view
    expect(
      await screen.findByText('Diagnostics List Component')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Diagnostics JSON Component')
    ).not.toBeInTheDocument();

    // Switch to JSON view
    const listbox = screen.getByRole('listbox');
    const jsonButton = within(listbox).getByRole('option', { name: /json/i });
    await user.click(jsonButton);

    expect(screen.getByText('Diagnostics JSON Component')).toBeInTheDocument();
    expect(
      screen.queryByText('Diagnostics List Component')
    ).not.toBeInTheDocument();

    // Switch back to list view
    const listButton = within(listbox).getByRole('option', { name: /list/i });
    await user.click(listButton);

    expect(screen.getByText('Diagnostics List Component')).toBeInTheDocument();
    expect(
      screen.queryByText('Diagnostics JSON Component')
    ).not.toBeInTheDocument();
  });

  it('should switch to JSON view when parsing error exists', async () => {
    setup({ responseType: 'parsing-error' });

    expect(
      await screen.findByText('Diagnostics JSON Component')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Diagnostics List Component')
    ).not.toBeInTheDocument();
  });

  it('should disable list view when parsing error exists', async () => {
    const { debug } = setup({ responseType: 'parsing-error' });

    const listbox = await screen.findByRole('listbox');
    const listButton = within(listbox).getByRole('option', { name: /list/i });
    debug();
    expect(listButton).toBeDisabled();
  });
});

function setup({
  responseType,
}: {
  responseType?: 'success' | 'error' | 'parsing-error' | 'pending';
} = {}) {
  const user = userEvent.setup();

  const renderResult = render(
    <ErrorBoundary fallbackRender={({ error }) => <div>{error.message}</div>}>
      <WorkflowDiagnosticsContent
        domain="test-domain"
        cluster="test-cluster"
        workflowId="test-workflow-id"
        runId="test-run-id"
      />
    </ErrorBoundary>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/diagnose',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => {
            switch (responseType) {
              case 'error':
                return HttpResponse.json(
                  { message: 'Failed to fetch diagnostics' },
                  { status: 500 }
                );
              case 'parsing-error':
                return HttpResponse.json({
                  result: { raw: 'invalid data' },
                  parsingError: new ZodError([]),
                } satisfies DiagnoseWorkflowResponse);
              case 'pending':
                return new Promise(() => {}); // Never resolves to simulate pending
              case 'success':
              default:
                return HttpResponse.json({
                  result: mockWorkflowDiagnosticsResult,
                  parsingError: null,
                } satisfies DiagnoseWorkflowResponse);
            }
          },
        },
      ],
    }
  );

  return { user, ...renderResult };
}
