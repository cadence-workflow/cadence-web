import React from 'react';
import ChevronUp from 'baseui/icon/chevron-up';
import ChevronDown from 'baseui/icon/chevron-down';

import type { Props } from './table-sortable-head-cell.types';
import { styled } from './table-sortable-head-cell.styles';

export default function TableSortableHeadCell({
  name,
  columnID,
  width,
  onSort,
  sortColumn,
  sortOrder,
}: Props) {
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
    <styled.SortableHeadCellRoot
      $size="compact"
      $divider="clean"
      $width={width}
      onClick={() => onSort(columnID)}
      $isFocusVisible={false}
    >
      <styled.SortableHeaderContainer aria-label={`${name}, ${sortLabel}`}>
        {name}
        {columnID === sortColumn && SortIcon && (
          <SortIcon size="16px" aria-hidden="true" role="presentation" />
        )}
      </styled.SortableHeaderContainer>
    </styled.SortableHeadCellRoot>
  );
}
