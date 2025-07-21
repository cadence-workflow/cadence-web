import { render, screen, userEvent } from '@/test-utils/rtl';

import ErrorBoundary from '@/components/error-boundary/error-boundary';
import { mockWorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/__fixtures__/mock-workflow-diagnostics-result';
import { type WorkflowDiagnosticsResult } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

import WorkflowDiagnosticsContent from '../workflow-diagnostics-content';

jest.mock('../../workflow-diagnostics-list/workflow-diagnostics-list', () =>
  jest.fn(() => <div>Diagnostics List Component</div>)
);

jest.mock('../../workflow-diagnostics-json/workflow-diagnostics-json', () =>
  jest.fn(() => <div>Diagnostics JSON Component</div>)
);

jest.mock(
  '../../workflow-diagnostics-view-toggle/workflow-diagnostics-view-toggle',
  () =>
    jest.fn(({ listEnabled, activeView, setActiveView }) => (
      <div data-testid="view-toggle">
        <div>Is list view enabled: {listEnabled.toString()}</div>
        <div>Active View: {activeView}</div>
        <button onClick={() => setActiveView('list')}>Switch to List</button>
        <button onClick={() => setActiveView('json')}>Switch to JSON</button>
      </div>
    ))
);

describe(WorkflowDiagnosticsContent.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render diagnostics list view by default', async () => {
    setup({ diagnosticsResult: mockWorkflowDiagnosticsResult });

    expect(
      await screen.findByText('Diagnostics List Component')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Diagnostics JSON Component')
    ).not.toBeInTheDocument();
  });

  it('should allow switching between list and JSON views', async () => {
    const { user } = setup({
      diagnosticsResult: mockWorkflowDiagnosticsResult,
    });

    // Initially shows list view
    expect(
      await screen.findByText('Diagnostics List Component')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Diagnostics JSON Component')
    ).not.toBeInTheDocument();

    // Switch to JSON view
    const jsonButton = screen.getByText('Switch to JSON');
    await user.click(jsonButton);

    expect(screen.getByText('Diagnostics JSON Component')).toBeInTheDocument();
    expect(
      screen.queryByText('Diagnostics List Component')
    ).not.toBeInTheDocument();

    // Switch back to list view
    const listButton = screen.getByText('Switch to List');
    await user.click(listButton);

    expect(screen.getByText('Diagnostics List Component')).toBeInTheDocument();
    expect(
      screen.queryByText('Diagnostics JSON Component')
    ).not.toBeInTheDocument();
  });

  it('should render view toggle with correct props', () => {
    setup({ diagnosticsResult: mockWorkflowDiagnosticsResult });

    expect(screen.getByTestId('view-toggle')).toBeInTheDocument();
    expect(screen.getByText('Is list view enabled: true')).toBeInTheDocument();
    expect(screen.getByText('Active View: list')).toBeInTheDocument();
  });
});

function setup({
  diagnosticsResult,
}: {
  diagnosticsResult: WorkflowDiagnosticsResult;
}) {
  const user = userEvent.setup();

  const renderResult = render(
    <ErrorBoundary fallbackRender={({ error }) => <div>{error.message}</div>}>
      <WorkflowDiagnosticsContent
        domain="test-domain"
        cluster="test-cluster"
        workflowId="test-workflow-id"
        runId="test-run-id"
        diagnosticsResult={diagnosticsResult}
      />
    </ErrorBoundary>
  );

  return { user, ...renderResult };
}
