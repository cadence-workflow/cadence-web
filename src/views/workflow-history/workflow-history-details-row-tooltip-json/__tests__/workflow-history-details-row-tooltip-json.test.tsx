import { render, screen } from '@/test-utils/rtl';

import WorkflowHistoryDetailsRowTooltipJson from '../workflow-history-details-row-tooltip-json';

jest.mock(
  '@/views/workflow-history/workflow-history-event-details-json/workflow-history-event-details-json',
  () =>
    jest.fn(({ entryValue, isNegative }) => (
      <div data-testid="event-details-json">
        Event Details Json: {JSON.stringify(entryValue)}
        {isNegative && ' (negative)'}
      </div>
    ))
);

describe(WorkflowHistoryDetailsRowTooltipJson.name, () => {
  it('renders the label and passes value to WorkflowHistoryEventDetailsJson', () => {
    render(
      <WorkflowHistoryDetailsRowTooltipJson
        value={{ key: 'value', nested: { number: 123 } }}
        label="test-label"
        isNegative={false}
        domain="test-domain"
        cluster="test-cluster"
        workflowId="test-workflow-id"
        runId="test-run-id"
      />
    );

    expect(screen.getByText('test-label')).toBeInTheDocument();
    expect(screen.getByTestId('event-details-json')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Event Details Json: \{"key":"value","nested":\{"number":123\}\}/
      )
    ).toBeInTheDocument();
  });
});
