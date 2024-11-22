import React from 'react';

import {
  StyledTable,
  StyledTableHead,
  StyledTableHeadRow,
  StyledTableBody,
  StyledTableBodyRow,
} from 'baseui/table-semantic';

import TableSortableHeadCell from './table-sortable-head-cell/table-sortable-head-cell';
import { styled } from './table.styles';
import type { Props, TableConfig } from './table.types';

export default function Table<T extends object, C extends TableConfig<T>>({
  data,
  columns,
  shouldShowResults,
  endMessage,
  ...sortParams
}: Props<T, C>) {
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
                  onSort={() => {}}
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
                    <styled.TableBodyCell
                      $size="compact"
                      $divider="clean"
                      key={`${column.id}-${rowIndex}`}
                    >
                      {<column.renderCell {...row} />}
                    </styled.TableBodyCell>
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
