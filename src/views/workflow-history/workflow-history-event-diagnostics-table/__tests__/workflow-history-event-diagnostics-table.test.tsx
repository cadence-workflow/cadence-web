import React from 'react';

import { render, screen } from '@/test-utils/rtl';

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
        name: 'Test Root Causes Parser',
        matcher: (key, value) =>
          ['Root Cause', 'Root Causes'].includes(key) && Array.isArray(value),
        renderValue: ({ value }) => (
          <div data-testid="root-causes-renderer">
            {value.length} root causes
          </div>
        ),
        forceWrap: true,
      },
      {
        name: 'Test Link Parser',
        matcher: (key, value) => key === 'ActivityScheduledID' && value !== 0,
        renderValue: ({ value }) => <span>Link: {String(value)}</span>,
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
    expect(screen.getByText('Link: 456')).toBeInTheDocument();

    expect(screen.getByText('objectKey')).toBeInTheDocument();
    expect(screen.getByTestId('json-renderer')).toBeInTheDocument();
    expect(screen.getByText('{"nested":"value"}')).toBeInTheDocument();

    expect(screen.getByText('emptyKey')).toBeInTheDocument();
    expect(screen.getByTestId('empty-string')).toBeInTheDocument();
  });

  it('uses the root causes renderer for Root Cause and Root Causes keys', () => {
    const metadata = {
      'Root Cause': [{ rootCauseType: 'A' }],
      'Root Causes': [{ rootCauseType: 'B' }, { rootCauseType: 'C' }],
    };

    setup({ metadata });

    expect(screen.getByText('Root Cause')).toBeInTheDocument();
    expect(screen.getByText('Root Causes')).toBeInTheDocument();
    expect(screen.getAllByTestId('root-causes-renderer')).toHaveLength(2);
    expect(screen.getByText('1 root causes')).toBeInTheDocument();
    expect(screen.getByText('2 root causes')).toBeInTheDocument();
    expect(screen.queryByTestId('json-renderer')).not.toBeInTheDocument();
  });

  it('falls back to the object renderer when Root Cause is not an array', () => {
    setup({ metadata: { 'Root Cause': { nested: 'value' } } });

    expect(screen.getByTestId('json-renderer')).toBeInTheDocument();
    expect(
      screen.queryByTestId('root-causes-renderer')
    ).not.toBeInTheDocument();
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
  it('renders rows with dividers and default padding', () => {
    setup({ metadata: { firstKey: 'first', secondKey: 'second' } });

    expect(screen.getByText('firstKey').parentElement).toHaveStyle({
      paddingTop: '6px',
      borderBottomWidth: '1px',
    });
  });

  it('renders rows without dividers and with smaller padding in compact mode', () => {
    setup({
      metadata: { firstKey: 'first', secondKey: 'second' },
      isCompact: true,
    });

    const firstRow = screen.getByText('firstKey').parentElement;
    expect(firstRow).toHaveStyle({ paddingTop: '2px', paddingBottom: '2px' });
    expect(firstRow).not.toHaveStyle({ borderBottomWidth: '1px' });
  });
});

function setup({
  metadata = {},
  isCompact,
}: {
  metadata?: Record<string, any>;
  isCompact?: boolean;
} = {}) {
  const props: Props = {
    metadata,
    isCompact,
  };

  render(<WorkflowHistoryEventDiagnosticsTable {...props} />);
}
