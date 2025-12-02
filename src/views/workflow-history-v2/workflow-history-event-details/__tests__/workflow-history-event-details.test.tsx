import { render, screen } from '@/test-utils/rtl';

import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import WorkflowHistoryEventDetails from '../workflow-history-event-details';
import { type EventDetailsEntries } from '../workflow-history-event-details.types';

jest.mock(
  '../../workflow-history-group-details-json/workflow-history-group-details-json',
  () =>
    jest.fn(
      ({
        entryPath,
        entryValue,
        isNegative,
      }: {
        entryPath: string;
        entryValue: any;
        isNegative?: boolean;
      }) => (
        <div data-testid="group-details-json">
          JSON: {entryPath} = {JSON.stringify(entryValue)}
          {isNegative && ' (negative)'}
        </div>
      )
    )
);

jest.mock(
  '@/views/workflow-history/workflow-history-event-details-group/workflow-history-event-details-group',
  () =>
    jest.fn(({ entries }: { entries: EventDetailsEntries }) => (
      <div data-testid="event-details-group">
        Event Details Group ({entries.length} entries)
      </div>
    ))
);

describe(WorkflowHistoryEventDetails.name, () => {
  it('renders "No Details" when eventDetails is empty', () => {
    setup({ eventDetails: [] });

    expect(screen.getByText('No Details')).toBeInTheDocument();
    expect(screen.queryByTestId('group-details-json')).not.toBeInTheDocument();
    expect(screen.queryByTestId('event-details-group')).not.toBeInTheDocument();
  });

  it('renders only rest details when no entries have showInPanels', () => {
    const eventDetails: EventDetailsEntries = [
      {
        key: 'key1',
        path: 'path1',
        value: 'value1',
        isGroup: false,
        renderConfig: {
          name: 'Test Config',
          key: 'key1',
        },
      },
      {
        key: 'key2',
        path: 'path2',
        value: 'value2',
        isGroup: false,
        renderConfig: null,
      },
    ];

    setup({ eventDetails });

    expect(screen.queryByTestId('group-details-json')).not.toBeInTheDocument();
    expect(screen.getByTestId('event-details-group')).toBeInTheDocument();
    expect(
      screen.getByText('Event Details Group (2 entries)')
    ).toBeInTheDocument();
  });

  it('renders panel details when entries have showInPanels flag', () => {
    const eventDetails: EventDetailsEntries = [
      {
        key: 'key1',
        path: 'path1',
        value: 'value1',
        isGroup: false,
        renderConfig: {
          name: 'Panel Config',
          key: 'key1',
          showInPanels: true,
        },
      },
      {
        key: 'key2',
        path: 'path2',
        value: 'value2',
        isGroup: false,
        renderConfig: {
          name: 'Rest Config',
          key: 'key2',
        },
      },
    ];

    setup({ eventDetails });

    expect(screen.getByTestId('group-details-json')).toBeInTheDocument();
    expect(screen.getByText(/JSON: path1 = "value1"/)).toBeInTheDocument();
    expect(screen.getByTestId('event-details-group')).toBeInTheDocument();
    expect(
      screen.getByText('Event Details Group (1 entries)')
    ).toBeInTheDocument();
  });

  it('renders multiple panel details', () => {
    const eventDetails: EventDetailsEntries = [
      {
        key: 'key1',
        path: 'path1',
        value: 'value1',
        isGroup: false,
        renderConfig: {
          name: 'Panel Config 1',
          key: 'key1',
          showInPanels: true,
        },
      },
      {
        key: 'key2',
        path: 'path2',
        value: { nested: 'value2' },
        isGroup: false,
        renderConfig: {
          name: 'Panel Config 2',
          key: 'key2',
          showInPanels: true,
        },
      },
      {
        key: 'key3',
        path: 'path3',
        value: 'value3',
        isGroup: false,
        renderConfig: {
          name: 'Rest Config',
          key: 'key3',
        },
      },
    ];

    setup({ eventDetails });

    const jsonComponents = screen.getAllByTestId('group-details-json');
    expect(jsonComponents).toHaveLength(2);
    expect(screen.getByText(/JSON: path1 = "value1"/)).toBeInTheDocument();
    expect(
      screen.getByText(/JSON: path2 = \{"nested":"value2"\}/)
    ).toBeInTheDocument();
    expect(screen.getByTestId('event-details-group')).toBeInTheDocument();
    expect(
      screen.getByText('Event Details Group (1 entries)')
    ).toBeInTheDocument();
  });

  it('passes correct props to WorkflowHistoryGroupDetailsJson', () => {
    const eventDetails: EventDetailsEntries = [
      {
        key: 'key1',
        path: 'path1',
        value: 'value1',
        isGroup: false,
        isNegative: true,
        renderConfig: {
          name: 'Panel Config',
          key: 'key1',
          showInPanels: true,
        },
      },
    ];

    setup({ eventDetails });

    expect(screen.getByText(/JSON: path1 = "value1"/)).toBeInTheDocument();
    expect(screen.getByText(/\(negative\)/)).toBeInTheDocument();
  });
});

function setup({
  eventDetails,
  workflowPageParams = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
  },
}: {
  eventDetails: EventDetailsEntries;
  workflowPageParams?: WorkflowPageParams;
}) {
  render(
    <WorkflowHistoryEventDetails
      eventDetails={eventDetails}
      workflowPageParams={workflowPageParams}
    />
  );
}
