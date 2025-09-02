import { render, screen, userEvent } from '@/test-utils/rtl';

import type { WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { scheduleActivityTaskEvent } from '../../__fixtures__/workflow-history-activity-events';
import type {
  ExtendedHistoryEvent,
  HistoryGroupEventMetadata,
} from '../../workflow-history.types';
import WorkflowHistoryEventSummary from '../workflow-history-event-summary';

jest.mock('@/utils/data-formatters/format-workflow-history-event', () =>
  jest.fn((event) =>
    event ? { mockFormatted: true, eventId: event.eventId } : null
  )
);

jest.mock('@/utils/data-formatters/format-pending-workflow-history-event', () =>
  jest.fn((event) =>
    event
      ? { mockPendingFormatted: true, computedEventId: event.computedEventId }
      : null
  )
);

jest.mock('../helpers/get-history-event-summary-items', () =>
  jest.fn(({ details, summaryFields }) => {
    if (!summaryFields || summaryFields.length === 0) return [];

    return summaryFields
      .filter((field: string) => details[field] !== undefined)
      .map((field: string, index: number) => ({
        path: field,
        label: field,
        value: details[field],
        icon: ({ size }: any) => (
          <span data-testid={`icon-${field}`} data-size={size} />
        ),
        renderValue: ({ value, isNegative }: any) => (
          <span data-testid={`field-${field}`} data-negative={isNegative}>
            {value}
          </span>
        ),
        hideDefaultTooltip: index === 0, // First field hides default tooltip
      }));
  })
);

const mockWorkflowPageParams: WorkflowPageParams = {
  cluster: 'test-cluster',
  domain: 'test-domain',
  workflowId: 'test-workflow',
  runId: 'test-run',
};

const mockEventMetadata: HistoryGroupEventMetadata = {
  label: 'Test Event',
  status: 'COMPLETED',
  timeMs: 1725747370632,
  timeLabel: 'Test time label',
  summaryFields: ['field1', 'field2', 'field3'],
  negativeFields: ['field2'],
  additionalDetails: {
    additionalField: 'additional-value',
    field1: 'value1',
    field2: 'mock-value',
    field3: 'value3',
  },
};

describe(WorkflowHistoryEventSummary.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render summary fields when eventMetadata has summaryFields', () => {
    setup();

    expect(screen.getByTestId('field-field1')).toBeInTheDocument();
    expect(screen.getByTestId('field-field2')).toBeInTheDocument();
    expect(screen.getByText('mock-value')).toBeInTheDocument();
  });

  it('should not render anything when eventMetadata has no summaryFields', () => {
    setup({
      eventMetadata: {
        ...mockEventMetadata,
        summaryFields: undefined,
      },
    });

    expect(screen.queryByTestId('field-field1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('field-field2')).not.toBeInTheDocument();
  });

  it('should not render anything when eventMetadata has empty summaryFields array', () => {
    setup({
      eventMetadata: {
        ...mockEventMetadata,
        summaryFields: [],
      },
    });

    expect(screen.queryByTestId('field-field1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('field-field2')).not.toBeInTheDocument();
  });

  it('should mark negative fields correctly', () => {
    setup();

    const negativeField = screen.getByTestId('field-field2');
    expect(negativeField).toHaveAttribute('data-negative', 'true');
  });

  it('should handle events with empty negativeFields array', () => {
    setup({
      eventMetadata: {
        ...mockEventMetadata,
        negativeFields: [],
      },
    });

    const field1 = screen.getByTestId('field-field1');
    const field2 = screen.getByTestId('field-field2');

    expect(field1).toHaveAttribute('data-negative', 'false');
    expect(field2).toHaveAttribute('data-negative', 'false');
  });

  it('should render icons when provided in field config', () => {
    setup();

    expect(screen.getByTestId('icon-field1')).toBeInTheDocument();
    expect(screen.getByTestId('icon-field2')).toBeInTheDocument();
    expect(screen.getByTestId('icon-field3')).toBeInTheDocument();
  });

  it('should render tooltip for fields without hideDefaultTooltip', async () => {
    const { user } = setup();

    const field2 = screen.getByTestId('field-field2');
    await user.hover(field2);

    // field2 should show default tooltip (field label as content)
    expect(await screen.findByText('field2')).toBeInTheDocument();
  });

  it('should not render tooltip for fields with hideDefaultTooltip', async () => {
    const { user } = setup();

    const field1 = screen.getByTestId('field-field1');
    await user.hover(field1);

    // field1 should not show tooltip since hideDefaultTooltip is true
    expect(screen.queryByText('field1')).not.toBeInTheDocument();
  });
});

function setup({
  event = scheduleActivityTaskEvent,
  eventMetadata = mockEventMetadata,
  workflowPageParams = mockWorkflowPageParams,
}: {
  event?: ExtendedHistoryEvent;
  eventMetadata?: HistoryGroupEventMetadata;
  workflowPageParams?: WorkflowPageParams;
} = {}) {
  const user = userEvent.setup();

  const renderResult = render(
    <WorkflowHistoryEventSummary
      event={event}
      eventMetadata={eventMetadata}
      {...workflowPageParams}
    />
  );

  return { user, ...renderResult };
}
