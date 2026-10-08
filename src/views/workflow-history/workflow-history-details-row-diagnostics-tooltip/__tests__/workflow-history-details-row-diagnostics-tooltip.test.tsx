import { render, screen, userEvent } from '@/test-utils/rtl';

import { type WorkflowDiagnosticsIssue } from '../../workflow-history.types';
import WorkflowHistoryDetailsRowDiagnosticsTooltip from '../workflow-history-details-row-diagnostics-tooltip';
import { type Props } from '../workflow-history-details-row-diagnostics-tooltip.types';

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

  it('does not render the open event button without a callback', () => {
    setup();

    expect(
      screen.queryByRole('button', { name: 'Open event' })
    ).not.toBeInTheDocument();
  });

  it('calls onClickOpenEvent when the open event button is clicked', async () => {
    const { user, onClickOpenEvent } = setup({
      onClickOpenEvent: jest.fn(),
    });

    const button = screen.getByRole('button', { name: 'Open event' });
    expect(button).toBeEnabled();

    await user.click(button);

    expect(onClickOpenEvent).toHaveBeenCalledTimes(1);
  });

  it('closes the tooltip when the open event button is clicked', async () => {
    const closeTooltip = jest.fn();
    const { user } = setup({ onClickOpenEvent: jest.fn(), closeTooltip });

    await user.click(screen.getByRole('button', { name: 'Open event' }));

    expect(closeTooltip).toHaveBeenCalledTimes(1);
  });

  it('disables the open event button when the event is open', async () => {
    const { user, onClickOpenEvent } = setup({
      onClickOpenEvent: jest.fn(),
      isEventOpen: true,
    });

    const button = screen.getByRole('button', { name: 'Open event' });
    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClickOpenEvent).not.toHaveBeenCalled();
  });

  it('does not propagate the click to parent elements', async () => {
    const onParentClick = jest.fn();
    const { user } = setup({ onClickOpenEvent: jest.fn() }, ({ children }) => (
      <div onClick={onParentClick}>{children}</div>
    ));

    await user.click(screen.getByRole('button', { name: 'Open event' }));

    expect(onParentClick).not.toHaveBeenCalled();
  });
});

function setup(
  props: Partial<Props> = {},
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

  return { user, onClickOpenEvent: props.onClickOpenEvent };
}
