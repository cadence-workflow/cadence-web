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

describe(WorkflowDiagnosticsFallback.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the view toggle with list disabled', () => {
    setup({
      diagnosticsResult: { raw: 'invalid data' },
    });

    expect(
      screen.getByTestId('workflow-diagnostics-view-toggle')
    ).toBeInTheDocument();
    expect(screen.getByText('List Enabled: false')).toBeInTheDocument();
  });

  it('renders the JSON component with correct props', () => {
    setup({
      diagnosticsResult: { raw: 'invalid data' },
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
});

function setup({ diagnosticsResult }: { diagnosticsResult: any }) {
  return render(
    <WorkflowDiagnosticsFallback
      workflowId="test-workflow-id"
      runId="test-run-id"
      diagnosticsResult={diagnosticsResult}
    />
  );
}
