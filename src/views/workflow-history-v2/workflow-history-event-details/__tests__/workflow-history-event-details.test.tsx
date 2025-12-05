import { render, screen } from '@/test-utils/rtl';

import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import type WorkflowHistoryPanelDetailsEntry from '../../workflow-history-panel-details-entry/workflow-history-panel-details-entry';
import WorkflowHistoryEventDetails from '../workflow-history-event-details';
import { type EventDetailsEntries } from '../workflow-history-event-details.types';

jest.mock<typeof WorkflowHistoryPanelDetailsEntry>(
  '../../workflow-history-panel-details-entry/workflow-history-panel-details-entry',
  () =>
    jest.fn(({ detail }) => (
      <div data-testid="panel-details-entry">
        Panel Entry: {detail.path} ={' '}
        {JSON.stringify(detail.isGroup ? detail.groupEntries : detail.value)}
        {detail.isNegative && ' (negative)'}
      </div>
    ))
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
    expect(screen.queryByTestId('panel-details-entry')).not.toBeInTheDocument();
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

    expect(screen.queryByTestId('panel-details-entry')).not.toBeInTheDocument();
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

    expect(screen.getByTestId('panel-details-entry')).toBeInTheDocument();
    expect(
      screen.getByText(/Panel Entry: path1 = "value1"/)
    ).toBeInTheDocument();
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

    const panelEntries = screen.getAllByTestId('panel-details-entry');
    expect(panelEntries).toHaveLength(2);
    expect(
      screen.getByText(/Panel Entry: path1 = "value1"/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Panel Entry: path2 = \{"nested":"value2"\}/)
    ).toBeInTheDocument();
    expect(screen.getByTestId('event-details-group')).toBeInTheDocument();
    expect(
      screen.getByText('Event Details Group (1 entries)')
    ).toBeInTheDocument();
  });

  it('correctly renders panel details entry', () => {
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

    expect(
      screen.getByText(/Panel Entry: path1 = "value1"/)
    ).toBeInTheDocument();
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
