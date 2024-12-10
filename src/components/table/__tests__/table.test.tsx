import React from 'react';

import { render, screen, fireEvent, act } from '@/test-utils/rtl';

import Table from '../table';

type TestDataT = {
  value: string;
};

const SAMPLE_DATA_NUM_ROWS = 10;
const SAMPLE_DATA_NUM_COLUMNS = 5;

jest.mock('../table-sortable-head-cell/table-sortable-head-cell', () =>
  jest.fn(({ name, columnID, onSort }) => (
    <th data-testid="sortable-head-cell" onClick={() => onSort(columnID)}>
      {name}
    </th>
  ))
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

    expect(await screen.findByText('Sample end message')).toBeDefined();
    expect(screen.queryAllByText(/Column Name \d+/)).toHaveLength(
      SAMPLE_DATA_NUM_COLUMNS
    );
    expect(screen.queryAllByText(/data_test_\d+_\d+/)).toHaveLength(0);
  });

  it('should call onSort when the table column is clicked', async () => {
    const { mockOnSort } = setup({ shouldShowResults: true });

    const columnElements = await screen.findAllByText(/Column Name \d+/);
    expect(columnElements.length).toEqual(5);

    const sortableColumnHeadCells =
      await screen.findAllByTestId('sortable-head-cell');
    expect(sortableColumnHeadCells.length).toEqual(5);

    act(() => {
      fireEvent.click(columnElements[0]);
    });

    expect(mockOnSort).toHaveBeenCalledWith('column_id_0');
  });

  it('should render plain head cells for sortable columns when onSort is missing', async () => {
    setup({ shouldShowResults: true, omitOnSort: true });

    const columnElements = await screen.findAllByText(/Column Name \d+/);
    expect(columnElements.length).toEqual(5);

    const sortableColumnHeadCells =
      screen.queryAllByTestId('sortable-head-cell');
    expect(sortableColumnHeadCells.length).toEqual(0);
  });
});

function setup({
  shouldShowResults,
  omitOnSort,
}: {
  shouldShowResults: boolean;
  omitOnSort?: boolean;
}) {
  const mockOnSort = jest.fn();
  render(
    <Table
      data={SAMPLE_ROWS}
      columns={SAMPLE_COLUMNS}
      shouldShowResults={shouldShowResults}
      endMessageProps={{
        kind: 'simple',
        content: <div>Sample end message</div>,
      }}
      {...(!omitOnSort && { onSort: mockOnSort })}
      sortColumn={SAMPLE_COLUMNS[SAMPLE_DATA_NUM_COLUMNS - 1].id}
      sortOrder="DESC"
    />
  );
  return { mockOnSort };
}
