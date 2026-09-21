import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import WorkflowHistoryEventDiagnosticsTable from '../workflow-history-event-diagnostics-table';
import {
  type WorkflowHistoryEventDiagnosticsParser,
  type Props,
} from '../workflow-history-event-diagnostics-table.types';

jest.mock(
  '@/views/workflow-history/config/workflow-history-diagnostics-parsers.config',
  () =>
    [
      {
        name: 'Test Link Parser',
        matcher: (key, value) => key === 'ActivityScheduledID' && value !== 0,
        renderValue: ({ value, onClickHistoryEvent }) => (
          <button onClick={() => onClickHistoryEvent(value)}>
            Link: {String(value)}
          </button>
        ),
      },
      {
        name: 'Test Object Parser',
        matcher: (_, value) => value !== null && typeof value === 'object',
        renderValue: ({ value }) => (
          <div data-testid="json-renderer">{JSON.stringify(value)}</div>
        ),
        forceWrap: true,
      },
      {
        name: 'Test Empty String Parser',
        matcher: (_, value) => value === '',
        renderValue: () => <span data-testid="empty-string">&quot;&quot;</span>,
      },
      {
        name: 'Test Null parser',
        matcher: (_, value) => value === null,
        hide: true,
      },
    ] satisfies Array<WorkflowHistoryEventDiagnosticsParser>
);

describe(WorkflowHistoryEventDiagnosticsTable.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders metadata items with string values when no parser matches', () => {
    const metadata = {
      simpleKey: 'simple value',
      numberKey: 123,
      booleanKey: true,
    };

    setup({ metadata });

    expect(screen.getByText('simpleKey')).toBeInTheDocument();
    expect(screen.getByText('simple value')).toBeInTheDocument();
    expect(screen.getByText('numberKey')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('booleanKey')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('renders metadata items with custom renderers when parsers match', () => {
    const metadata = {
      ActivityScheduledID: 456,
      objectKey: { nested: 'value' },
      emptyKey: '',
    };

    setup({ metadata });

    expect(screen.getByText('ActivityScheduledID')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Link: 456' })
    ).toBeInTheDocument();

    expect(screen.getByText('objectKey')).toBeInTheDocument();
    expect(screen.getByTestId('json-renderer')).toBeInTheDocument();
    expect(screen.getByText('{"nested":"value"}')).toBeInTheDocument();

    expect(screen.getByText('emptyKey')).toBeInTheDocument();
    expect(screen.getByTestId('empty-string')).toBeInTheDocument();
  });

  it('passes onClickHistoryEvent to matching parsers', async () => {
    const { user, mockOnClickHistoryEvent } = setup({
      metadata: { ActivityScheduledID: 456 },
    });

    await user.click(screen.getByRole('button', { name: 'Link: 456' }));

    expect(mockOnClickHistoryEvent).toHaveBeenCalledWith(456);
  });

  it('hides values when parser is configured with hide: true', () => {
    const metadata = {
      visibleKey: 'visible value',
      nullKey: null,
      anotherNullKey: null,
      regularKey: 'regular value',
    };

    setup({ metadata });

    // Null values should be hidden by the null parser
    expect(screen.queryByText('nullKey')).not.toBeInTheDocument();
    expect(screen.queryByText('anotherNullKey')).not.toBeInTheDocument();
    expect(screen.queryByText('null')).not.toBeInTheDocument();

    // Other values should still be visible
    expect(screen.getByText('visibleKey')).toBeInTheDocument();
    expect(screen.getByText('visible value')).toBeInTheDocument();
    expect(screen.getByText('regularKey')).toBeInTheDocument();
    expect(screen.getByText('regular value')).toBeInTheDocument();
  });

  it('handles undefined values gracefully', () => {
    const metadata = {
      nullKey: null,
      undefinedKey: undefined,
    };

    setup({ metadata });

    expect(screen.getByText('undefinedKey')).toBeInTheDocument();
    expect(screen.getByText('undefined')).toBeInTheDocument();
  });

  it('handles complex object values', () => {
    const metadata = {
      complexObject: {
        nested: {
          array: [1, 2, 3],
          string: 'test',
          number: 42,
        },
      },
    };

    setup({ metadata });

    expect(screen.getByText('complexObject')).toBeInTheDocument();
    expect(screen.getByTestId('json-renderer')).toBeInTheDocument();
    expect(
      screen.getByText(
        '{"nested":{"array":[1,2,3],"string":"test","number":42}}'
      )
    ).toBeInTheDocument();
  });

  it('handles metadata with empty objects and arrays', () => {
    const metadata = {
      emptyObject: {},
      emptyArray: [],
      objectWithEmptyArray: { items: [] },
      arrayWithEmptyObject: [{}],
    };

    setup({ metadata });

    expect(screen.getByText('emptyObject')).toBeInTheDocument();
    expect(screen.getByText('{}')).toBeInTheDocument();
    expect(screen.getByText('emptyArray')).toBeInTheDocument();
    expect(screen.getByText('[]')).toBeInTheDocument();
    expect(screen.getByText('objectWithEmptyArray')).toBeInTheDocument();
    expect(screen.getByText('{"items":[]}')).toBeInTheDocument();
    expect(screen.getByText('arrayWithEmptyObject')).toBeInTheDocument();
    expect(screen.getByText('[{}]')).toBeInTheDocument();
  });
});

function setup({
  metadata = {},
}: {
  metadata?: Record<string, any>;
} = {}) {
  const user = userEvent.setup();
  const mockOnClickHistoryEvent = jest.fn();

  const props: Props = {
    metadata,
    onClickHistoryEvent: mockOnClickHistoryEvent,
  };

  render(<WorkflowHistoryEventDiagnosticsTable {...props} />);

  return { user, mockOnClickHistoryEvent };
}
