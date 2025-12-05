import { render, screen } from '@/test-utils/rtl';

import type WorkflowHistoryEventDetailsGroup from '@/views/workflow-history/workflow-history-event-details-group/workflow-history-event-details-group';
import { type WorkflowPageParams } from '@/views/workflow-page/workflow-page.types';

import {
  type EventDetailsGroupEntry,
  type EventDetailsSingleEntry,
} from '../../workflow-history-event-details/workflow-history-event-details.types';
import WorkflowHistoryPanelDetailsEntry from '../workflow-history-panel-details-entry';

jest.mock<typeof WorkflowHistoryEventDetailsGroup>(
  '@/views/workflow-history/workflow-history-event-details-group/workflow-history-event-details-group',
  () =>
    jest.fn(({ entries, parentGroupPath }) => (
      <div data-testid="event-details-group">
        <div>{`Event Details Group (${entries.length} entries)`}</div>
        <div>{parentGroupPath && ` - Parent: ${parentGroupPath}`}</div>
      </div>
    ))
);

describe(WorkflowHistoryPanelDetailsEntry.name, () => {
  it('renders a single entry with value', () => {
    const detail: EventDetailsSingleEntry = {
      key: 'test-key',
      path: 'test.path',
      value: 'test-value',
      isGroup: false,
      renderConfig: null,
    };

    setup({ detail });

    expect(screen.getByText('test.path')).toBeInTheDocument();
    expect(screen.getByText('test-value')).toBeInTheDocument();
  });

  it('renders a group entry with WorkflowHistoryEventDetailsGroup', () => {
    const detail: EventDetailsGroupEntry = {
      key: 'test-key',
      path: 'test.group.path',
      isGroup: true,
      groupEntries: [
        {
          key: 'entry1',
          path: 'test.group.path.entry1',
          value: 'value1',
          isGroup: false,
          renderConfig: null,
        },
        {
          key: 'entry2',
          path: 'test.group.path.entry2',
          value: 'value2',
          isGroup: false,
          renderConfig: null,
        },
      ],
      renderConfig: null,
    };

    setup({ detail });

    expect(screen.getByText('test.group.path')).toBeInTheDocument();
    expect(screen.getByTestId('event-details-group')).toBeInTheDocument();
    expect(
      screen.getByText('Event Details Group (2 entries)')
    ).toBeInTheDocument();
    expect(screen.getByText(/Parent: test\.group\.path/)).toBeInTheDocument();
  });

  it('renders a custom ValueComponent when provided for a single entry', () => {
    const MockValueComponent = jest.fn(
      ({
        entryKey,
        entryPath,
        entryValue,
        isNegative,
        domain,
        cluster,
      }: {
        entryKey: string;
        entryPath: string;
        entryValue: any;
        isNegative?: boolean;
        domain: string;
        cluster: string;
      }) => (
        <div data-testid="custom-value-component">
          Custom: {entryKey} - {entryPath} - {JSON.stringify(entryValue)}
          {isNegative && ' (negative)'}
          {domain} - {cluster}
        </div>
      )
    );

    const detail: EventDetailsSingleEntry = {
      key: 'test-key',
      path: 'test.path',
      value: 'test-value',
      isGroup: false,
      renderConfig: {
        name: 'Test Config',
        key: 'test-key',
        valueComponent: MockValueComponent,
      },
    };

    setup({
      detail,
      workflowPageParams: {
        domain: 'test-domain',
        cluster: 'test-cluster',
        workflowId: 'test-workflow-id',
        runId: 'test-run-id',
      },
    });

    expect(screen.getByTestId('custom-value-component')).toBeInTheDocument();
    expect(
      screen.getByText(/Custom: test-key - test\.path - "test-value"/)
    ).toBeInTheDocument();
    expect(screen.getByText(/test-domain - test-cluster/)).toBeInTheDocument();
  });

  it('does not render ValueComponent for group entries', () => {
    const MockValueComponent = jest.fn(() => (
      <div data-testid="custom-value-component">Custom Component</div>
    ));

    const detail: EventDetailsGroupEntry = {
      key: 'test-key',
      path: 'test.group.path',
      isGroup: true,
      groupEntries: [
        {
          key: 'entry1',
          path: 'test.group.path.entry1',
          value: 'value1',
          isGroup: false,
          renderConfig: null,
        },
      ],
      renderConfig: {
        name: 'Test Config',
        key: 'test-key',
        valueComponent: MockValueComponent,
      },
    };

    setup({ detail });

    expect(
      screen.queryByTestId('custom-value-component')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('event-details-group')).toBeInTheDocument();
  });
});

function setup({
  detail,
  workflowPageParams = {
    domain: 'test-domain',
    cluster: 'test-cluster',
    workflowId: 'test-workflow-id',
    runId: 'test-run-id',
  },
}: {
  detail: EventDetailsSingleEntry | EventDetailsGroupEntry;
  workflowPageParams?: WorkflowPageParams;
}) {
  render(
    <WorkflowHistoryPanelDetailsEntry detail={detail} {...workflowPageParams} />
  );
}
