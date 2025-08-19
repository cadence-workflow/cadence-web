import React from 'react';

import { render } from '@/test-utils/rtl';

import WorkflowHistoryEventSummaryJsonPreview from '../workflow-history-event-summary-json-preview';

jest.mock(
  '../../workflow-history-event-details-json/workflow-history-event-details-json',
  () =>
    jest.fn(({ entryValue, isNegative }) => (
      <div data-testid="mock-details-json" data-negative={isNegative ?? false}>
        {JSON.stringify(entryValue)}
      </div>
    ))
);

describe(WorkflowHistoryEventSummaryJsonPreview.name, () => {
  const defaultProps = {
    name: 'Test Field',
    value: { test: 'data' },
    isNegative: false,
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
  };

  it('renders correctly with default props', () => {
    const { getByText, getByTestId } = render(
      <WorkflowHistoryEventSummaryJsonPreview {...defaultProps} />
    );

    expect(getByText('Test Field')).toBeInTheDocument();
    expect(getByTestId('mock-details-json')).toBeInTheDocument();
  });

  it('renders the name label correctly', () => {
    const { getByText } = render(
      <WorkflowHistoryEventSummaryJsonPreview
        {...defaultProps}
        name="Custom Name"
      />
    );

    expect(getByText('Custom Name')).toBeInTheDocument();
  });

  it('passes isNegative prop correctly', () => {
    const { getByTestId } = render(
      <WorkflowHistoryEventSummaryJsonPreview
        {...defaultProps}
        isNegative={true}
      />
    );

    const detailsJson = getByTestId('mock-details-json');
    expect(detailsJson).toHaveAttribute('data-negative', 'true');
  });
});
