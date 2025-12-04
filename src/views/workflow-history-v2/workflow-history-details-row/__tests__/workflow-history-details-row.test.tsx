import { render, screen, userEvent } from '@/test-utils/rtl';

import type { WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import { type EventDetailsEntries } from '../../workflow-history-event-details/workflow-history-event-details.types';
import WorkflowHistoryDetailsRow from '../workflow-history-details-row';
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
              {value}
            </span>
          ),
          renderTooltip: ({ label }: any) => (
            <span data-testid={`tooltip-${entry.path}`}>{label}</span>
          ),
          invertTooltipColors: acc.length === 1, // Second item has inverted tooltip
          omitWrapping: acc.length === 2, // Third item omits wrapping
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
});

function setup({
  detailsEntries = mockDetailsEntries,
  workflowPageParams = mockWorkflowPageParams,
}: {
  detailsEntries?: EventDetailsEntries;
  workflowPageParams?: WorkflowPageParams;
} = {}) {
  const user = userEvent.setup();

  const renderResult = render(
    <WorkflowHistoryDetailsRow
      detailsEntries={detailsEntries}
      {...workflowPageParams}
    />
  );

  return { user, ...renderResult };
}
