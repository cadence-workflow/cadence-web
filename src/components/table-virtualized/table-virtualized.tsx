import React, { useState } from 'react';

import {
  StyledTable,
  StyledTableHead,
  StyledTableHeadRow,
  StyledTableBody,
  StyledTableBodyRow,
} from 'baseui/table-semantic';
import omit from 'lodash/omit';
import { TableVirtuoso } from 'react-virtuoso';

import TableBodyCell from '../table/table-body-cell/table-body-cell';
import TableFooterMessage from '../table/table-footer-message/table-footer-message';
import TableInfiniteScrollLoader from '../table/table-infinite-scroll-loader/table-infinite-scroll-loader';
import TableRoot from '../table/table-root/table-root';
import TableHeadCell from '../table/table-head-cell/table-head-cell';

import type { Props, TableConfig } from './table-virtualized.types';

export default function TableVirtualized<
  T extends object,
  C extends TableConfig<T>,
>({
  data,
  columns,
  shouldShowResults,
  endMessageProps,
  onSort,
  sortColumn,
  sortOrder,
  ...virtuosoProps
}: Props<T, C>) {
  const [showFooter, setShowFooter] = useState(false);
  const dataToRender = shouldShowResults ? data : [];
  return (
    <TableRoot>
      <TableVirtuoso
        {...virtuosoProps}
        fixedFooterContent={() =>
          showFooter ? (
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
          ) : null
        }
        itemsRendered={(rendered) => {
          if (!showFooter)
            setShowFooter(
              !dataToRender.length ||
                (dataToRender.length > 0 && rendered.length > 0)
            );
          virtuosoProps.itemsRendered?.(rendered);
        }}
        components={{
          Table: StyledTable,
          TableHead: function (props: { style?: React.CSSProperties }) {
            return (
              <StyledTableHead
                {...props}
                style={{ ...(props.style || {}), position: 'static' }}
              />
            );
          },
          TableBody: StyledTableBody,
          TableRow: (props) => <StyledTableBodyRow {...omit(props, 'items')} />,
          TableFoot: (props: { style?: React.CSSProperties }) => (
            <tfoot {...props} style={{ ...props.style, position: 'static' }} />
          ),
          ...virtuosoProps.components,
        }}
        data={dataToRender}
        fixedHeaderContent={() => (
          <StyledTableHeadRow>
            {columns.map((column) => (
              <TableHeadCell
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
        )}
        itemContent={(rowIndex, row) => (
          <>
            {columns.map((column) => {
              return (
                <TableBodyCell
                  $size="compact"
                  $divider="clean"
                  key={`${column.id}-${rowIndex}`}
                  style={{ width: column.width, maxWidth: column.width }}
                >
                  {<column.renderCell {...row} />}
                </TableBodyCell>
              );
            })}
          </>
        )}
      />
    </TableRoot>
  );
}
