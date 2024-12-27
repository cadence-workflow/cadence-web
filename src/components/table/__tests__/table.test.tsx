import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import Table from '../table';
import { type EndMessageProps } from '../table.types';

type TestDataT = {
  value: string;
};

const SAMPLE_DATA_NUM_ROWS = 10;
const SAMPLE_DATA_NUM_COLUMNS = 5;

jest.mock('../table-head-cell/table-head-cell', () =>
  jest.fn(({ name, columnID, onSort }) => (
    <th onClick={() => onSort(columnID)}>{name}</th>
  ))
);
jest.mock('../table-body-cell/table-body-cell', () =>
  jest.fn(({ children }) => <td>{children}</td>)
);
jest.mock('../table-root/table-root', () =>
  jest.fn(({ children }) => <div>{children}</div>)
);
jest.mock('../table-footer-message/table-footer-message', () =>
  jest.fn(({ children }) => <div>{children}</div>)
);
jest.mock('../table-infinite-scroll-loader/table-infinite-scroll-loader', () =>
  jest.fn(() => <div>Infinite Loader</div>)
);

const SAMPLE_ROWS: Array<TestDataT> = Array.from(
  { length: SAMPLE_DATA_NUM_ROWS },
  (_, rowIndex) => ({ value: `test_${rowIndex}` })
);

const SAMPLE_COLUMNS = Array.from(
  { length: SAMPLE_DATA_NUM_COLUMNS },
  (_, colIndex) => ({
    name: `Column Name ${colIndex}`,
    id: `column_id_${colIndex}`,
    sortable: true,
    renderCell: ({ value }: TestDataT) => {
      return `data_${value}_${colIndex}`;
    },
    width: `${100 / SAMPLE_DATA_NUM_COLUMNS}%`,
  })
);

describe('Table', () => {
  it('should render without error', async () => {
    setup({ shouldShowResults: true });

    expect(await screen.findByText('Sample end message')).toBeDefined();
    expect(screen.queryAllByText(/Column Name \d+/)).toHaveLength(
      SAMPLE_DATA_NUM_COLUMNS
    );
    expect(screen.queryAllByText(/data_test_\d+_\d+/)).toHaveLength(
      SAMPLE_DATA_NUM_ROWS * SAMPLE_DATA_NUM_COLUMNS
    );
  });

  it('should render empty if shouldShowResults is false, even if data is present', async () => {
    setup({ shouldShowResults: false });

    expect(screen.queryAllByText(/Column Name \d+/)).toHaveLength(
      SAMPLE_DATA_NUM_COLUMNS
    );
    expect(screen.queryAllByText(/data_test_\d+_\d+/)).toHaveLength(0);
  });

  it('should show the end message if shouldShowResults', async () => {
    setup({ shouldShowResults: true });

    expect(await screen.findByText('Sample end message')).toBeDefined();
  });

  it('should show the end message if not shouldShowResults', async () => {
    setup({ shouldShowResults: false });

    expect(await screen.findByText('Sample end message')).toBeDefined();
  });

  it('should render TableInfiniteScrollLoader when loader kind is infinite-scroll', async () => {
    setup({
      shouldShowResults: false,
      endMessageProps: {
        kind: 'infinite-scroll',
        hasData: true,
        fetchNextPage: () => undefined,
        error: null,
        hasNextPage: false,
        isFetchingNextPage: false,
      },
    });

    expect(await screen.findByText('Infinite Loader')).toBeDefined();
  });
});

function setup({
  shouldShowResults,
  omitOnSort,
  endMessageProps,
}: {
  shouldShowResults: boolean;
  omitOnSort?: boolean;
  endMessageProps?: EndMessageProps;
}) {
  const mockOnSort = jest.fn();
  render(
    <Table
      data={SAMPLE_ROWS}
      columns={SAMPLE_COLUMNS}
      shouldShowResults={shouldShowResults}
      endMessageProps={
        endMessageProps || {
          kind: 'simple',
          content: <div>Sample end message</div>,
        }
      }
      {...(!omitOnSort && { onSort: mockOnSort })}
      sortColumn={SAMPLE_COLUMNS[SAMPLE_DATA_NUM_COLUMNS - 1].id}
      sortOrder="DESC"
    />
  );
  return { mockOnSort };
}
