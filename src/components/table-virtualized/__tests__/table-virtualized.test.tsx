import React from 'react';

import { VirtuosoMockContext } from 'react-virtuoso';

import { render, screen, fireEvent, act, waitFor } from '@/test-utils/rtl';

import TableVirtualized from '../table-virtualized';

type TestDataT = {
  value: string;
};

const SAMPLE_DATA_NUM_ROWS = 10;
const SAMPLE_DATA_NUM_COLUMNS = 5;

jest.mock('../../table/table-sortable-head-cell/table-sortable-head-cell', () =>
  jest.fn(({ name, columnID, onSort }) => (
    <th data-testid="sortable-head-cell" onClick={() => onSort(columnID)}>
      {name}
    </th>
  ))
);
jest.mock('../../table/table-body-cell/table-body-cell', () =>
  jest.fn(({ children }) => <td>{children}</td>)
);
jest.mock('../../table/table-root/table-root', () =>
  jest.fn(({ children }) => <div>{children}</div>)
);
jest.mock('../../table/table-footer-message/table-footer-message', () =>
  jest.fn(({ children }) => <div>{children}</div>)
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

describe('TableVirtualized', () => {
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
    <TableVirtualized
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
    />,
    undefined,
    {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 1000, itemHeight: 100 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    }
  );
  return { mockOnSort };
}
