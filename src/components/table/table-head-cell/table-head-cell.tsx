import React from 'react';

import ChevronDown from 'baseui/icon/chevron-down';
import ChevronUp from 'baseui/icon/chevron-up';

import { styled } from './table-head-cell.styles';
import type { Props } from './table-head-cell.types';

export default function TableHeadCell({
  name,
  columnID,
  width,
  onSort,
  sortColumn,
  sortOrder,
  isSortable,
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

  if (isSortable) {
    return (
      <styled.SortableHeadCellRoot
        $size="compact"
        $divider="clean"
        $width={width}
        $isFocusVisible={false}
        {...(onSort ? { onClick: () => onSort(columnID) } : null)}
      >
        <styled.HeaderContainer aria-label={`${name}, ${sortLabel}`}>
          {name}
          {columnID === sortColumn && SortIcon && (
            <SortIcon size="16px" aria-hidden="true" role="presentation" />
          )}
        </styled.HeaderContainer>
      </styled.SortableHeadCellRoot>
    );
  }

  return (
    <styled.HeadCellRoot $size="compact" $divider="clean" $width={width}>
      <styled.HeaderContainer aria-label={name}>{name}</styled.HeaderContainer>
    </styled.HeadCellRoot>
  );
}
