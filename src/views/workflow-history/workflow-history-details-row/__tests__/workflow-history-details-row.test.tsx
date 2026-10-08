import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import type { WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { type EventDetailsEntries } from '../../workflow-history-event-details/workflow-history-event-details.types';
import { type WorkflowDiagnosticsIssue } from '../../workflow-history.types';
import getParsedDetailsRowItems from '../helpers/get-parsed-details-row-items';
import WorkflowHistoryDetailsRow from '../workflow-history-details-row';
import { DIAGNOSTICS_ISSUES_DETAILS_PATH } from '../workflow-history-details-row.constants';
import { type DetailsRowItem } from '../workflow-history-details-row.types';

jest.mock('../helpers/get-parsed-details-row-items', () =>
  jest.fn((detailsEntries: EventDetailsEntries) =>
    detailsEntries.reduce<Array<DetailsRowItem>>((acc, entry) => {
      if (!entry.isGroup) {
        acc.push({
          path: entry.path,
          label: entry.path,
          value: entry.value,
          icon: ({ size }: any) => (
            <span data-testid={`icon-${entry.path}`} data-size={size} />
          ),
          renderValue: ({ value, isNegative }: any) => (
            <span
              data-testid={`field-${entry.path}`}
              data-negative={isNegative}
            >
              {String(value)}
            </span>
          ),
          renderTooltip: ({ label, closeTooltip }: any) => (
            <span data-testid={`tooltip-${entry.path}`}>
              {label}
              <button onClick={closeTooltip}>Close {entry.path}</button>
            </span>
          ),
          invertTooltipColors: acc.length === 1, // Second item has inverted tooltip
          omitWrapping: acc.length === 2, // Third item omits wrapping
          hasClickableContent: acc.length === 0, // First item has clickable content
        });
      }
      return acc;
    }, [])
  )
);

const mockWorkflowPageParams: WorkflowPageParams = {
  cluster: 'test-cluster',
  domain: 'test-domain',
  workflowId: 'test-workflow',
  runId: 'test-run',
};

const mockDetailsEntries: EventDetailsEntries = [
  {
    key: 'field1',
    path: 'field1',
    isGroup: false,
    value: 'value1',
    isNegative: false,
    renderConfig: null,
  },
  {
    key: 'field2',
    path: 'field2',
    isGroup: false,
    value: 'value2',
    isNegative: true,
    renderConfig: null,
  },
  {
    key: 'field3',
    path: 'field3',
    isGroup: false,
    value: 'value3',
    isNegative: false,
    renderConfig: null,
  },
];

describe(WorkflowHistoryDetailsRow.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render details row items when detailsEntries has items', () => {
    setup();

    expect(screen.getByTestId('field-field1')).toBeInTheDocument();
    expect(screen.getByTestId('field-field2')).toBeInTheDocument();
    expect(screen.getByTestId('field-field3')).toBeInTheDocument();
    expect(screen.getByText('value1')).toBeInTheDocument();
    expect(screen.getByText('value2')).toBeInTheDocument();
    expect(screen.getByText('value3')).toBeInTheDocument();
  });

  it('should mark negative fields correctly', () => {
    setup();

    const negativeField = screen.getByTestId('field-field2');
    expect(negativeField).toHaveAttribute('data-negative', 'true');

    const positiveField = screen.getByTestId('field-field1');
    expect(positiveField).toHaveAttribute('data-negative', 'false');
  });

  it('should render icons when provided in item config', () => {
    setup();

    expect(screen.getByTestId('icon-field1')).toBeInTheDocument();
    expect(screen.getByTestId('icon-field2')).toBeInTheDocument();
    expect(screen.getByTestId('icon-field3')).toBeInTheDocument();
  });

  it('should render tooltip content on hover', async () => {
    const { user } = setup();

    const field1 = screen.getByTestId('field-field1');
    await user.hover(field1);

    expect(await screen.findByTestId('tooltip-field1')).toBeInTheDocument();
    expect(screen.getByText('field1')).toBeInTheDocument();
  });

  it('should close the tooltip when the tooltip content calls closeTooltip', async () => {
    const { user } = setup();

    await user.hover(screen.getByTestId('field-field1'));
    await user.click(
      await screen.findByRole('button', { name: 'Close field1' })
    );

    await waitFor(() =>
      expect(screen.queryByTestId('tooltip-field1')).not.toBeInTheDocument()
    );
  });

  it('should stop click event propagation when hasClickableContent is true', async () => {
    const onParentClick = jest.fn();
    const { user } = setup({
      wrapper: ({ children }) => <div onClick={onParentClick}>{children}</div>,
    });

    // field1 has hasClickableContent: true
    const field1 = screen.getByTestId('field-field1');
    await user.click(field1);

    expect(onParentClick).not.toHaveBeenCalled();
  });

  it('should allow click event propagation when hasClickableContent is false', async () => {
    const onParentClick = jest.fn();
    const { user } = setup({
      wrapper: ({ children }) => <div onClick={onParentClick}>{children}</div>,
    });

    // field2 does not have hasClickableContent: true
    const field2 = screen.getByTestId('field-field2');
    await user.click(field2);

    expect(onParentClick).toHaveBeenCalled();
  });

  it('should forward diagnostics issues as the last details entry', () => {
    const issues: Array<WorkflowDiagnosticsIssue> = [
      {
        issueId: 0,
        invariantType: 'Activity Failed',
        reason: 'Reason 0',
        metadata: {},
        rootCauses: [],
      },
    ];

    setup({ diagnosticsIssues: issues });

    expect(getParsedDetailsRowItems).toHaveBeenLastCalledWith([
      ...mockDetailsEntries,
      expect.objectContaining({
        path: DIAGNOSTICS_ISSUES_DETAILS_PATH,
        value: issues,
      }),
    ]);
  });

  it('should not forward a diagnostics entry when there are no issues', () => {
    setup({ diagnosticsIssues: [] });

    expect(getParsedDetailsRowItems).toHaveBeenLastCalledWith(
      mockDetailsEntries
    );
  });
});

function setup({
  detailsEntries = mockDetailsEntries,
  diagnosticsIssues,
  workflowPageParams = mockWorkflowPageParams,
  wrapper,
}: {
  detailsEntries?: EventDetailsEntries;
  diagnosticsIssues?: Array<WorkflowDiagnosticsIssue>;
  workflowPageParams?: WorkflowPageParams;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
} = {}) {
  const user = userEvent.setup();

  const renderResult = render(
    <WorkflowHistoryDetailsRow
      detailsEntries={detailsEntries}
      diagnosticsIssues={diagnosticsIssues}
      {...workflowPageParams}
    />,
    undefined,
    { wrapper }
  );

  return { user, ...renderResult };
}
