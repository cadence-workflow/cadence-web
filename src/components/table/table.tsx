import React from 'react';
import {
  StyledTable,
  StyledTableHead,
  StyledTableHeadRow,
  StyledTableBody,
  StyledTableBodyRow,
  StyledTableBodyCell,
} from 'baseui/table-semantic';

import type { Props } from './table.types';
import { styled } from './table.styles';
import TableSortableHeadCell from './table-sortable-head-cell/table-sortable-head-cell';

export default function Table<T extends Object>({
  data,
  columns,
  shouldShowResults,
  endMessage,
  ...sortParams
}: Props<T>) {
  return (
    <styled.TableRoot>
      <StyledTable>
        <StyledTableHead>
          <StyledTableHeadRow>
            {columns.map((column) =>
              column.sortable ? (
                <TableSortableHeadCell
                  key={column.id}
                  name={column.name}
                  columnID={column.id}
                  width={column.width}
                  {...sortParams}
                />
              ) : (
                <styled.TableHeadCell
                  $size="compact"
                  $divider="clean"
                  $width={column.width}
                  key={column.id}
                >
                  {column.name}
                </styled.TableHeadCell>
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
                    <StyledTableBodyCell
                      $size="compact"
                      $divider="clean"
                      key={`${column.id}-${rowIndex}`}
                    >
                      {<column.renderCell {...row} />}
                    </StyledTableBodyCell>
                  );
                })}
              </StyledTableBodyRow>
            ))}
          <tr>
            <td colSpan={columns.length}>
              <styled.TableMessage>{endMessage}</styled.TableMessage>
            </td>
          </tr>
        </StyledTableBody>
      </StyledTable>
    </styled.TableRoot>
  );
}
