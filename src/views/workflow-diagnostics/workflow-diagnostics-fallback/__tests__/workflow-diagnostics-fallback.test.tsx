import { render, screen } from '@/test-utils/rtl';

import WorkflowDiagnosticsFallback from '../workflow-diagnostics-fallback';

jest.mock('../../workflow-diagnostics-json/workflow-diagnostics-json', () =>
  jest.fn(({ workflowId, runId, diagnosticsResult }) => (
    <div data-testid="workflow-diagnostics-json">
      <div>Workflow ID: {workflowId}</div>
      <div>Run ID: {runId}</div>
      <div>Diagnostics Result: {JSON.stringify(diagnosticsResult)}</div>
    </div>
  ))
);

jest.mock(
  '../../workflow-diagnostics-view-toggle/workflow-diagnostics-view-toggle',
  () =>
    jest.fn(({ listEnabled }) => (
      <div data-testid="workflow-diagnostics-view-toggle">
        <div>List Enabled: {listEnabled.toString()}</div>
      </div>
    ))
);

describe('WorkflowDiagnosticsFallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the view toggle with list disabled', () => {
    const mockDiagnosticsResult = { raw: 'invalid data' };
    setup({
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
      diagnosticsResult: mockDiagnosticsResult,
    });

    expect(
      screen.getByTestId('workflow-diagnostics-view-toggle')
    ).toBeInTheDocument();
    expect(screen.getByText('List Enabled: false')).toBeInTheDocument();
  });

  it('renders the JSON component with correct props', () => {
    const mockDiagnosticsResult = { raw: 'invalid data' };
    setup({
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
      diagnosticsResult: mockDiagnosticsResult,
    });

    expect(screen.getByTestId('workflow-diagnostics-json')).toBeInTheDocument();
    expect(
      screen.getByText('Workflow ID: test-workflow-id')
    ).toBeInTheDocument();
    expect(screen.getByText('Run ID: test-run-id')).toBeInTheDocument();
    expect(
      screen.getByText('Diagnostics Result: {"raw":"invalid data"}')
    ).toBeInTheDocument();
  });

  it('passes correct props to child components', () => {
    const mockDiagnosticsResult = { raw: 'invalid data' };
    const mockJsonComponent = jest.requireMock(
      '../../workflow-diagnostics-json/workflow-diagnostics-json'
    );
    const mockViewToggleComponent = jest.requireMock(
      '../../workflow-diagnostics-view-toggle/workflow-diagnostics-view-toggle'
    );

    setup({
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
      diagnosticsResult: mockDiagnosticsResult,
    });

    expect(mockJsonComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        workflowId: 'test-workflow-id',
        runId: 'test-run-id',
        diagnosticsResult: mockDiagnosticsResult,
      }),
      expect.anything()
    );

    expect(mockViewToggleComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        listEnabled: false,
      }),
      expect.anything()
    );
  });

  it('renders with complex diagnostics result', () => {
    const complexResult = {
      DiagnosticsResult: {
        Timeouts: null,
        Failures: {
          Issues: [
            {
              IssueID: 1,
              InvariantType: 'Activity Failed',
              Reason: 'Test failure',
              Metadata: { ActivityType: 'test.activity' },
            },
          ],
        },
      },
      DiagnosticsCompleted: true,
    };

    setup({
      workflowId: 'test-workflow-id',
      runId: 'test-run-id',
      diagnosticsResult: complexResult,
    });

    expect(screen.getByTestId('workflow-diagnostics-json')).toBeInTheDocument();
    expect(
      screen.getByText('Workflow ID: test-workflow-id')
    ).toBeInTheDocument();
    expect(screen.getByText('Run ID: test-run-id')).toBeInTheDocument();
  });
});

function setup({
  workflowId,
  runId,
  diagnosticsResult,
}: {
  workflowId: string;
  runId: string;
  diagnosticsResult: any;
}) {
  return render(
    <WorkflowDiagnosticsFallback
      workflowId={workflowId}
      runId={runId}
      diagnosticsResult={diagnosticsResult}
    />
  );
}
