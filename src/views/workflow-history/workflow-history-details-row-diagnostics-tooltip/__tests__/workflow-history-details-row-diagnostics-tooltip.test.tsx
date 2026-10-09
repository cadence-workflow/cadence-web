import { render, screen, userEvent } from '@/test-utils/rtl';

import { type DetailsRowTooltipComponentProps } from '../../workflow-history-details-row/workflow-history-details-row.types';
import { type WorkflowDiagnosticsIssue } from '../../workflow-history.types';
import WorkflowHistoryDetailsRowDiagnosticsTooltip from '../workflow-history-details-row-diagnostics-tooltip';

const mockIssues: Array<WorkflowDiagnosticsIssue> = [
  {
    issueId: 1,
    invariantType: 'Activity Failed',
    reason: 'The activity returned an error',
    metadata: null,
    rootCauses: [],
  },
  {
    issueId: 2,
    invariantType: 'Decision Timed Out',
    reason: 'The decision task timed out',
    metadata: null,
    rootCauses: [],
  },
];

describe(WorkflowHistoryDetailsRowDiagnosticsTooltip.name, () => {
  it('renders the type and reason of each issue', () => {
    setup();

    expect(screen.getByText('Activity Failed')).toBeInTheDocument();
    expect(
      screen.getByText('The activity returned an error')
    ).toBeInTheDocument();
    expect(screen.getByText('Decision Timed Out')).toBeInTheDocument();
    expect(screen.getByText('The decision task timed out')).toBeInTheDocument();
  });

  it('does not render the show issues button without a callback', () => {
    setup();

    expect(
      screen.queryByRole('button', { name: 'Show issues' })
    ).not.toBeInTheDocument();
  });

  it('does not render the show issues button when the event is expanded', () => {
    setup({ onExpandEvent: jest.fn(), isEventExpanded: true });

    expect(
      screen.queryByRole('button', { name: 'Show issues' })
    ).not.toBeInTheDocument();
  });

  it('calls onExpandEvent when the show issues button is clicked', async () => {
    const { user, onExpandEvent } = setup({
      onExpandEvent: jest.fn(),
    });

    const button = screen.getByRole('button', { name: 'Show issues' });
    expect(button).toBeEnabled();

    await user.click(button);

    expect(onExpandEvent).toHaveBeenCalledTimes(1);
  });

  it('closes the tooltip when the show issues button is clicked', async () => {
    const onCloseTooltip = jest.fn();
    const { user } = setup({ onExpandEvent: jest.fn(), onCloseTooltip });

    await user.click(screen.getByRole('button', { name: 'Show issues' }));

    expect(onCloseTooltip).toHaveBeenCalledTimes(1);
  });

  it('does not propagate the click to parent elements', async () => {
    const onParentClick = jest.fn();
    const { user } = setup({ onExpandEvent: jest.fn() }, ({ children }) => (
      <div onClick={onParentClick}>{children}</div>
    ));

    await user.click(screen.getByRole('button', { name: 'Show issues' }));

    expect(onParentClick).not.toHaveBeenCalled();
  });
});

function setup(
  props: Partial<DetailsRowTooltipComponentProps> = {},
  wrapper?: React.ComponentType<{ children: React.ReactNode }>
) {
  const user = userEvent.setup();

  render(
    <WorkflowHistoryDetailsRowDiagnosticsTooltip
      label="Diagnostics issues"
      value={mockIssues}
      domain="test-domain"
      cluster="test-cluster"
      workflowId="test-workflow-id"
      runId="test-run-id"
      {...props}
    />,
    undefined,
    { wrapper }
  );

  return { user, onExpandEvent: props.onExpandEvent };
}
