import { render, screen } from '@/test-utils/rtl';

import WorkflowHistoryDetailsRowJson from '../workflow-history-details-row-json';

describe(WorkflowHistoryDetailsRowJson.name, () => {
  it('renders the stringified JSON value', () => {
    render(
      <WorkflowHistoryDetailsRowJson
        value={{ key: 'value', nested: { number: 123 } }}
        isNegative={false}
        label="test-label"
        domain="test-domain"
        cluster="test-cluster"
        workflowId="test-workflow-id"
        runId="test-run-id"
      />
    );

    expect(
      screen.getByText('{"key":"value","nested":{"number":123}}')
    ).toBeInTheDocument();
  });
});
