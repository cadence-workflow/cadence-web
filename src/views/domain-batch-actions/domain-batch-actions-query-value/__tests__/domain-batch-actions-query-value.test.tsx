import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import DomainBatchActionQueryValue from '../domain-batch-actions-query-value';

describe(DomainBatchActionQueryValue.name, () => {
  it('renders the query as a JSON-stringified value', () => {
    render(<DomainBatchActionQueryValue query='WorkflowType="foo"' />);
    expect(screen.getByText('"WorkflowType=\\"foo\\""')).toBeInTheDocument();
  });

  it('reveals the full query in a tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<DomainBatchActionQueryValue query='WorkflowType="foo"' />);

    await user.hover(screen.getByText('"WorkflowType=\\"foo\\""'));

    await waitFor(() => {
      // Both the pill and the tooltip render the value once hovered.
      expect(screen.getAllByText('"WorkflowType=\\"foo\\""')).toHaveLength(2);
    });
  });
});
