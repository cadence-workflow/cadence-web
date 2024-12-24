import React from 'react';

import ChevronDown from 'baseui/icon/chevron-down';
import ChevronUp from 'baseui/icon/chevron-up';

import { styled } from './table-sortable-head-cell.styles';
import type { Props } from './table-sortable-head-cell.types';

export default function TableSortableHeadCell({
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
  const HeadCellComponent = isSortable
    ? styled.SortableHeadCellRoot
    : styled.HeadCellRoot;
  const ariaLabel = isSortable ? `${name}, ${sortLabel}` : name;

  return (
    <HeadCellComponent
      $size="compact"
      $divider="clean"
      $width={width}
      $isFocusVisible={false}
      {...(onSort && isSortable ? { onClick: () => onSort(columnID) } : null)}
    >
      <styled.HeaderContainer aria-label={ariaLabel}>
        {name}
        {isSortable && columnID === sortColumn && SortIcon && (
          <SortIcon size="16px" aria-hidden="true" role="presentation" />
        )}
      </styled.HeaderContainer>
    </HeadCellComponent>
  );
}
