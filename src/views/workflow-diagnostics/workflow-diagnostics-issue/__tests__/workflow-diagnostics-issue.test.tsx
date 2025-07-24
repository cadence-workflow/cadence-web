import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { mockWorkflowDiagnosticsIssueGroups } from '../../__fixtures__/mock-workflow-diagnostics-issue-groups';
import WorkflowDiagnosticsIssue from '../workflow-diagnostics-issue';
import { type Props } from '../workflow-diagnostics-issue.types';

jest.mock(
  '../../workflow-diagnostics-metadata-table/workflow-diagnostics-metadata-table',
  () => {
    return function MockWorkflowDiagnosticsMetadataTable({ metadata }: any) {
      return (
        <div data-testid="workflow-diagnostics-metadata-table">
          {JSON.stringify(metadata)}
        </div>
      );
    };
  }
);

const mockIssue = mockWorkflowDiagnosticsIssueGroups[1][1].issues[0];
const mockRootCauses =
  mockWorkflowDiagnosticsIssueGroups[1][1].rootCauses.slice(0, 1);

describe(WorkflowDiagnosticsIssue.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders issue header with correct content', () => {
    setup({});

    expect(screen.getByText('Activity Failed')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('shows content when expanded', () => {
    setup({ isExpanded: true });

    expect(
      screen.getByText(
        'The failure is because of an error returned from the service code'
      )
    ).toBeInTheDocument();
  });

  it('renders root causes when they exist', () => {
    setup({ isExpanded: true });

    expect(screen.getByText('Root Cause')).toBeInTheDocument();
    expect(
      screen.getByText(
        'There is an issue in the worker service that is causing a failure. Check identity for service logs'
      )
    ).toBeInTheDocument();
  });

  it('renders multiple root causes with correct label', () => {
    const multipleRootCauses = [
      mockRootCauses[0],
      { ...mockRootCauses[0], rootCauseType: 'Another root cause' },
    ];

    setup({ rootCauses: multipleRootCauses, isExpanded: true });

    expect(screen.getByText('Root Causes')).toBeInTheDocument();
    expect(
      screen.getByText(
        'There is an issue in the worker service that is causing a failure. Check identity for service logs'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Another root cause')).toBeInTheDocument();
  });

  it('does not render root causes section when no root causes exist', () => {
    setup({ rootCauses: [] });

    expect(screen.queryByText('Root Cause')).not.toBeInTheDocument();
    expect(screen.queryByText('Root Causes')).not.toBeInTheDocument();
  });

  it('renders issue metadata when it exists', () => {
    setup({ isExpanded: true });

    expect(screen.getByText('Metadata')).toBeInTheDocument();
    expect(
      screen.getByTestId('workflow-diagnostics-metadata-table')
    ).toBeInTheDocument();
  });

  it('does not render metadata section when issue has no metadata', () => {
    const issueWithoutMetadata = { ...mockIssue, metadata: null };
    setup({ issue: issueWithoutMetadata, isExpanded: true });

    expect(screen.queryByText('Metadata')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('workflow-diagnostics-metadata-table')
    ).not.toBeInTheDocument();
  });

  it('renders root cause metadata when it exists', () => {
    const rootCauseWithMetadata = {
      ...mockRootCauses[0],
      metadata: { testKey: 'testValue' },
    };

    setup({ rootCauses: [rootCauseWithMetadata], isExpanded: true });

    const metadataTables = screen.getAllByTestId(
      'workflow-diagnostics-metadata-table'
    );
    expect(metadataTables).toHaveLength(2); // One for issue metadata, one for root cause metadata
  });

  it('renders details button with correct text and calls onChangePanel when clicked', async () => {
    const { user, mockOnChangePanel } = setup({});

    const detailsButton = screen.getByText('Details');
    expect(detailsButton).toBeInTheDocument();

    await user.click(detailsButton);

    expect(mockOnChangePanel).toHaveBeenCalledTimes(1);
  });
});

function setup(overrides: Partial<Props>) {
  const user = userEvent.setup();
  const mockOnChangePanel = jest.fn();

  const props = {
    issue: mockIssue,
    rootCauses: mockRootCauses,
    isExpanded: false,
    onChangePanel: mockOnChangePanel,
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
    ...overrides,
  };

  const renderResult = render(<WorkflowDiagnosticsIssue {...props} />);

  return { ...renderResult, mockOnChangePanel, user };
}
