import { HttpResponse } from 'msw';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { type DiagnoseWorkflowResponse } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

import WorkflowDiagnosticsContent from '../workflow-diagnostics-content';

// Mock all subcomponents
jest.mock(
  '@/components/section-loading-indicator/section-loading-indicator',
  () => jest.fn(() => <div data-testid="loading-indicator">Loading...</div>)
);

jest.mock('../workflow-diagnostics-list/workflow-diagnostics-list', () =>
  jest.fn(
    ({
      diagnosticsResponse,
    }: {
      diagnosticsResponse: DiagnoseWorkflowResponse;
    }) => (
      <div data-testid="diagnostics-list">
        Diagnostics List Component
        <div data-testid="diagnostics-data">
          {JSON.stringify(diagnosticsResponse)}
        </div>
      </div>
    )
  )
);

jest.mock('../workflow-diagnostics-json/workflow-diagnostics-json', () =>
  jest.fn(
    ({
      diagnosticsResponse,
    }: {
      diagnosticsResponse: DiagnoseWorkflowResponse;
    }) => (
      <div data-testid="diagnostics-json">
        Diagnostics JSON Component
        <div data-testid="diagnostics-data">
          {JSON.stringify(diagnosticsResponse)}
        </div>
      </div>
    )
  )
);

// Mock the hook
const mockUseDiagnoseWorkflow = jest.fn();
jest.mock('../hooks/use-diagnose-workflow/use-diagnose-workflow', () =>
  jest.fn(() => mockUseDiagnoseWorkflow())
);

describe('WorkflowDiagnosticsContent', () => {
  const defaultProps = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
  };

  const mockDiagnosticsResponse: DiagnoseWorkflowResponse = {
    result: {
      DiagnosticsResult: {
        'test-diagnostic': {
          Issues: [
            {
              IssueID: 1,
              InvariantType: 'test-invariant',
              Reason: 'Test diagnostic error',
              Metadata: { timestamp: '2023-01-01T00:00:00Z' },
            },
          ],
          RootCause: [
            {
              IssueID: 1,
              RootCauseType: 'test-root-cause',
              Metadata: { severity: 'high' },
            },
          ],
          Runbooks: ['test-runbook-1', 'test-runbook-2'],
        },
      },
      DiagnosticsCompleted: true,
    },
    parsingError: null,
  };

  const mockParsingErrorResponse: DiagnoseWorkflowResponse = {
    result: { raw: 'invalid data' },
    parsingError: {
      name: 'ZodError',
      message: 'Invalid data format',
      issues: [],
    } as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup({
    hookReturnValue,
    endpointsMocks,
  }: {
    hookReturnValue?: ReturnType<typeof mockUseDiagnoseWorkflow>;
    endpointsMocks?: any[];
  } = {}) {
    if (hookReturnValue) {
      mockUseDiagnoseWorkflow.mockReturnValue(hookReturnValue);
    }

    const user = userEvent.setup();

    const renderResult = render(
      <WorkflowDiagnosticsContent {...defaultProps} />,
      {
        endpointsMocks,
      }
    );

    return { user, ...renderResult };
  }

  it('should render loading indicator when status is pending', async () => {
    setup({
      hookReturnValue: {
        data: undefined,
        error: undefined,
        status: 'pending',
      },
    });

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should throw error when status is error', async () => {
    const mockError = new Error('Failed to fetch diagnostics');

    let renderErrorMessage;
    try {
      setup({
        hookReturnValue: {
          data: undefined,
          error: mockError,
          status: 'error',
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch diagnostics');
  });

  it('should render diagnostics list view by default', async () => {
    setup({
      hookReturnValue: {
        data: mockDiagnosticsResponse,
        error: undefined,
        status: 'success',
      },
    });

    expect(screen.getByTestId('diagnostics-list')).toBeInTheDocument();
    expect(screen.queryByTestId('diagnostics-json')).not.toBeInTheDocument();
  });

  it('should switch to JSON view when parsing error exists', async () => {
    setup({
      hookReturnValue: {
        data: mockParsingErrorResponse,
        error: undefined,
        status: 'success',
      },
    });

    expect(screen.getByTestId('diagnostics-json')).toBeInTheDocument();
    expect(screen.queryByTestId('diagnostics-list')).not.toBeInTheDocument();
  });

  it('should allow switching between list and JSON views', async () => {
    const { user } = setup({
      hookReturnValue: {
        data: mockDiagnosticsResponse,
        error: undefined,
        status: 'success',
      },
    });

    // Initially shows list view
    expect(screen.getByTestId('diagnostics-list')).toBeInTheDocument();
    expect(screen.queryByTestId('diagnostics-json')).not.toBeInTheDocument();

    // Switch to JSON view
    const jsonButton = screen.getByRole('button', { name: /json/i });
    await user.click(jsonButton);

    expect(screen.getByTestId('diagnostics-json')).toBeInTheDocument();
    expect(screen.queryByTestId('diagnostics-list')).not.toBeInTheDocument();

    // Switch back to list view
    const listButton = screen.getByRole('button', { name: /list/i });
    await user.click(listButton);

    expect(screen.getByTestId('diagnostics-list')).toBeInTheDocument();
    expect(screen.queryByTestId('diagnostics-json')).not.toBeInTheDocument();
  });

  it('should disable list view when parsing error exists', async () => {
    setup({
      hookReturnValue: {
        data: mockParsingErrorResponse,
        error: undefined,
        status: 'success',
      },
    });

    const listButton = screen.getByRole('button', { name: /list/i });
    expect(listButton).toBeDisabled();
  });

  it('should pass correct props to view components', async () => {
    setup({
      hookReturnValue: {
        data: mockDiagnosticsResponse,
        error: undefined,
        status: 'success',
      },
    });

    const diagnosticsData = screen.getByTestId('diagnostics-data');
    expect(diagnosticsData).toHaveTextContent(
      JSON.stringify(mockDiagnosticsResponse)
    );
  });

  it('should handle API error response', async () => {
    const mockError = new Error('API Error');

    let renderErrorMessage;
    try {
      setup({
        hookReturnValue: {
          data: undefined,
          error: mockError,
          status: 'error',
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('API Error');
  });

  it('should render with MSW endpoint mock', async () => {
    setup({
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/runs/:runId/diagnose',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: mockDiagnosticsResponse,
        },
      ],
    });

    // The component should render with the mocked data
    expect(screen.getByTestId('diagnostics-list')).toBeInTheDocument();
  });

  it('should handle MSW error response', async () => {
    let renderErrorMessage;
    try {
      setup({
        endpointsMocks: [
          {
            path: '/api/domains/:domain/:cluster/workflows/:workflowId/runs/:runId/diagnose',
            httpMethod: 'GET',
            mockOnce: false,
            httpResolver: () => {
              return HttpResponse.json(
                { message: 'Failed to fetch diagnostics' },
                { status: 500 }
              );
            },
          },
        ],
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch diagnostics');
  });
});
