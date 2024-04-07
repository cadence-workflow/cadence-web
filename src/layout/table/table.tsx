import React from 'react';
import { styled, withStyle, type Theme } from 'baseui';
import {
  StyledRoot,
  StyledTable,
  StyledTableHead,
  StyledTableHeadRow,
  StyledTableHeadCell,
  StyledTableHeadCellSortable,
  StyledTableBody,
  StyledTableBodyRow,
  StyledTableBodyCell,
  StyledTableLoadingMessage,
} from 'baseui/table-semantic';
import ChevronUp from 'baseui/icon/chevron-up';
import ChevronDown from 'baseui/icon/chevron-down';

import { SortingOrder } from './table.types';

const SortableHeaderContainer = styled('div', ({ $theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: $theme.sizing.scale300,
}));

const TableRoot = withStyle(StyledRoot, ({ $theme }) => ({
  alignSelf: 'center',
  flex: '1 1 0',
  overflow: 'visible',
  width: '100%',
}));

const TableMessage = withStyle(StyledTableLoadingMessage, ({ $theme }) => ({
  display: 'flex',
  justifyContent: 'center',
}));

const tableHeadCellStyles = ($theme: Theme) => ({
  ...$theme.typography.LabelXSmall,
  color: '#a6a6a6',
});

const TableHeadCell = withStyle(StyledTableHeadCell, ({ $theme }) => ({
  ...tableHeadCellStyles($theme),
}));

const TableHeadCellSortable = withStyle(StyledTableHeadCellSortable, ({ $theme }) => ({
  ...tableHeadCellStyles($theme),
}));

function TableMessageCell({
  numColumns,
  children,
}: {
  numColumns: number;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={numColumns}>
        <TableMessage>{children}</TableMessage>
      </td>
    </tr>
  );
}

function SortableTableHeadCell({
  name,
  columnID,
  sortColumn,
  sortOrder,
  onSort,
}: {
  name: string;
  columnID: string;
  sortColumn?: string;
  sortOrder?: string;
  onSort: (column: string) => void;
}) {
  let SortIcon, sortLabel;

  switch (columnID === sortColumn && sortOrder) {
    case 'ASC':
      SortIcon = ChevronUp;
      sortLabel = 'ascending sorting';
      break;
    case 'DESC':
      SortIcon = ChevronDown;
      sortLabel = 'descending sorting';
      break;
    default:
      SortIcon = null;
      sortLabel = 'not sorted';
      break;
  }

  return (
    <TableHeadCellSortable
      $size='compact'
      $divider="clean"
      onClick={() => onSort(columnID)}
      $isFocusVisible={false}
    >
      <SortableHeaderContainer aria-label={`${columnID}, ${sortLabel}`}>
        {name}
        {columnID === sortColumn && SortIcon && <SortIcon size="16px" aria-hidden="true" role="presentation" />}
      </SortableHeaderContainer>
    </TableHeadCellSortable>
  );
}

export type TableColumn<T> = {
  name: string;
  id: string;
  renderCell: React.ComponentType<T> | ((row: T) => React.ReactNode);
  sortable?: boolean;
};

export type Props<T> = {
  data: Array<T>;
  columns: Array<TableColumn<T>>;
  shouldShowResults: boolean;
  endMessage: React.ReactNode;
  // Sort params
  onSort: (column: string) => void;
  sortColumn: string;
  sortOrder: SortingOrder;
};

function Table<T extends Object>({
  data,
  columns,
  shouldShowResults,
  endMessage,
  ...sortParams
}: Props<T>) {
  return (
    <TableRoot>
      <StyledTable>
        <StyledTableHead>
          <StyledTableHeadRow>
            {columns.map((column) =>
              column.sortable ? (
                <SortableTableHeadCell
                  key={column.id}
                  name={column.name}
                  columnID={column.id}
                  {...sortParams}
                />
              ) : (
                <TableHeadCell $size="compact" $divider="clean" key={column.id}>
                  {column.name}
                </TableHeadCell>
              )
            )}
          </StyledTableHeadRow>
        </StyledTableHead>
        <StyledTableBody>
          {shouldShowResults &&
            data.map((row: T, rowIndex: number) => (
              <StyledTableBodyRow key={rowIndex}>
                {columns.map((column) => {
                  return (
                    <StyledTableBodyCell $size='compact' $divider="clean" key={`${column.id}-${rowIndex}`}>
                      {<column.renderCell {...row} />}
                    </StyledTableBodyCell>
                  );
                })}
              </StyledTableBodyRow>
            ))}
          <TableMessageCell numColumns={columns.length}>{endMessage}</TableMessageCell>
        </StyledTableBody>
      </StyledTable>
    </TableRoot>
  );
}

export default Table;
