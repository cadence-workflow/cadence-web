import { render, screen } from '@/test-utils/rtl';

import { type WorkflowDiagnosticsRootCause } from '@/route-handlers/diagnose-workflow/diagnose-workflow.types';

import WorkflowHistoryEventDiagnosticsRootCauses from '../workflow-history-event-diagnostics-root-causes';

jest.mock(
  '../../workflow-history-event-diagnostics-table/workflow-history-event-diagnostics-table',
  () =>
    jest.fn(({ metadata, isCompact }) => (
      <div data-testid="metadata-table" data-compact={String(isCompact)}>
        {JSON.stringify(metadata)}
      </div>
    ))
);

jest.mock(
  '../../workflow-history-event-diagnostics-placeholder-text/workflow-history-event-diagnostics-placeholder-text',
  () =>
    jest.fn(({ placeholderText }) => (
      <div data-testid="placeholder-text">{placeholderText}</div>
    ))
);

describe(WorkflowHistoryEventDiagnosticsRootCauses.name, () => {
  it('renders the type of each root cause', () => {
    setup({
      value: [
        { issueId: 0, rootCauseType: 'Activity Timeout', metadata: {} },
        { issueId: 0, rootCauseType: 'Worker Unavailable', metadata: {} },
      ],
    });

    expect(screen.getByText('Activity Timeout')).toBeInTheDocument();
    expect(screen.getByText('Worker Unavailable')).toBeInTheDocument();
  });

  it('renders a metadata table for non-empty metadata and a placeholder otherwise', () => {
    setup({
      value: [
        {
          issueId: 0,
          rootCauseType: 'Activity Timeout',
          metadata: { ExpectedTimeout: 30 },
        },
        { issueId: 0, rootCauseType: 'Empty object', metadata: {} },
        { issueId: 0, rootCauseType: 'No metadata', metadata: undefined },
        { issueId: 0, rootCauseType: 'Null metadata', metadata: null },
      ],
    });

    const tables = screen.getAllByTestId('metadata-table');
    expect(tables).toHaveLength(1);
    expect(tables[0]).toHaveTextContent('{"ExpectedTimeout":30}');
    expect(tables[0]).toHaveAttribute('data-compact', 'true');

    const placeholders = screen.getAllByTestId('placeholder-text');
    expect(placeholders).toHaveLength(3);
    placeholders.forEach((placeholder) =>
      expect(placeholder).toHaveTextContent('No metadata')
    );
  });
});

function setup({ value }: { value: Array<WorkflowDiagnosticsRootCause> }) {
  render(<WorkflowHistoryEventDiagnosticsRootCauses value={value} />);
}
