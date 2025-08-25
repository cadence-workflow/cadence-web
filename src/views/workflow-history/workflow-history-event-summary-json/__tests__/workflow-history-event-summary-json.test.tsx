import React from 'react';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import WorkflowHistoryEventSummaryJson from '../workflow-history-event-summary-json';

jest.mock(
  '../../workflow-history-event-details-json/workflow-history-event-details-json',
  () =>
    jest.fn(({ entryValue, isNegative }) => (
      <div data-testid="mock-details-json" data-negative={isNegative ?? false}>
        {JSON.stringify(entryValue)}
      </div>
    ))
);

describe(WorkflowHistoryEventSummaryJson.name, () => {
  it('renders correctly with default props', () => {
    setup();

    expect(screen.getByText(/{"test":"data"}/)).toBeInTheDocument();
  });

  it('renders the label correctly in tooltip', async () => {
    const { user } = setup();

    const jsonContainer = screen.getByText(/{"test":"data"}/);
    await user.hover(jsonContainer);

    expect(await screen.findByText('Test Field')).toBeInTheDocument();
  });

  it('passes isNegative prop correctly to details component', async () => {
    const { user } = setup({ isNegative: true });

    const jsonContainer = screen.getByText(/{"test":"data"}/);
    await user.hover(jsonContainer);

    const detailsJson = await screen.findByTestId('mock-details-json');
    expect(detailsJson).toHaveAttribute('data-negative', 'true');
  });

  it('shows tooltip content on hover', async () => {
    const { user } = setup();

    const jsonContainer = screen.getByText(/{"test":"data"}/);
    await user.hover(jsonContainer);

    expect(await screen.findByText('Test Field')).toBeInTheDocument();
    expect(await screen.findByTestId('mock-details-json')).toBeInTheDocument();
  });

  it('hides tooltip on unhover', async () => {
    const { user } = setup();

    const jsonContainer = screen.getByText(/{"test":"data"}/);
    await user.hover(jsonContainer);

    expect(await screen.findByText('Test Field')).toBeInTheDocument();

    await user.unhover(jsonContainer);

    await waitFor(() => {
      expect(screen.queryByText('Test Field')).not.toBeInTheDocument();
    });
  });
});

function setup({ isNegative = false }: { isNegative?: boolean } = {}) {
  const user = userEvent.setup();

  const renderResult = render(
    <WorkflowHistoryEventSummaryJson
      label="Test Field"
      value={{ test: 'data' }}
      isNegative={isNegative}
      domain="test-domain"
      cluster="test-cluster"
      workflowId="test-workflow-id"
      runId="test-run-id"
    />
  );

  return { user, ...renderResult };
}
