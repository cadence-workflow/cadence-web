import React from 'react';

import {
  StyledTable,
  StyledTableHead,
  StyledTableHeadRow,
  StyledTableBody,
  StyledTableBodyRow,
} from 'baseui/table-semantic';

import TableBodyCell from './table-body-cell/table-body-cell';
import TableFooterMessage from './table-footer-message/table-footer-message';
import TableInfiniteScrollLoader from './table-infinite-scroll-loader/table-infinite-scroll-loader';
import TableRoot from './table-root/table-root';
import TableSortableHeadCell from './table-sortable-head-cell/table-sortable-head-cell';
import type { Props, TableConfig } from './table.types';

export default function Table<T extends object, C extends TableConfig<T>>({
  data,
  columns,
  shouldShowResults,
  endMessageProps,
  onSort,
  sortColumn,
  sortOrder,
}: Props<T, C>) {
  return (
    <TableRoot>
      <StyledTable>
        <StyledTableHead>
          <StyledTableHeadRow>
            {columns.map((column) => (
              <TableSortableHeadCell
                key={column.id}
                name={column.name}
                columnID={column.id}
                width={column.width}
                onSort={onSort}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                isSortable={Boolean(column.sortable)}
              />
            ))}
          </StyledTableHeadRow>
        </StyledTableHead>
        <StyledTableBody>
          {shouldShowResults &&
            data.map((row: T, rowIndex: number) => (
              <StyledTableBodyRow key={rowIndex}>
                {columns.map((column) => {
                  return (
                    <TableBodyCell
                      $size="compact"
                      $divider="clean"
                      key={`${column.id}-${rowIndex}`}
                    >
                      {<column.renderCell {...row} />}
                    </TableBodyCell>
                  );
                })}
              </StyledTableBodyRow>
            ))}
          <tr>
            <td colSpan={columns.length}>
              <TableFooterMessage>
                {endMessageProps.kind === 'infinite-scroll' ? (
                  <TableInfiniteScrollLoader {...endMessageProps} />
                ) : (
                  <>{endMessageProps.content}</>
                )}
              </TableFooterMessage>
            </td>
          </tr>
        </StyledTableBody>
      </StyledTable>
    </TableRoot>
  );
}
