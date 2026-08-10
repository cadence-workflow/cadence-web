import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { BATCH_ACTION_QUERY_MAX_DISPLAY_LENGTH } from '../../domain-batch-actions.constants';
import DomainBatchActionQueryValue from '../domain-batch-actions-query-value';

describe(DomainBatchActionQueryValue.name, () => {
  it('renders the query as-is', () => {
    render(<DomainBatchActionQueryValue query='WorkflowType="foo"' />);
    expect(screen.getByText('WorkflowType="foo"')).toBeInTheDocument();
  });

  it('reveals the full query in a tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<DomainBatchActionQueryValue query='WorkflowType="foo"' />);

    await user.hover(screen.getByText('WorkflowType="foo"'));

    await waitFor(() => {
      // Both the pill and the tooltip render the value once hovered.
      expect(screen.getAllByText('WorkflowType="foo"')).toHaveLength(2);
    });
  });

  it('caps large queries in both the pill and the tooltip', async () => {
    const user = userEvent.setup();
    const longQuery = 'A'.repeat(BATCH_ACTION_QUERY_MAX_DISPLAY_LENGTH + 50);
    const capped = `${'A'.repeat(BATCH_ACTION_QUERY_MAX_DISPLAY_LENGTH)}…`;
    render(<DomainBatchActionQueryValue query={longQuery} />);

    expect(screen.getByText(capped)).toBeInTheDocument();
    // The full query is never rendered.
    expect(screen.queryByText(longQuery)).not.toBeInTheDocument();

    await user.hover(screen.getByText(capped));

    await waitFor(() => {
      // Both the pill and the tooltip render the capped value once hovered.
      expect(screen.getAllByText(capped)).toHaveLength(2);
    });
  });
});
