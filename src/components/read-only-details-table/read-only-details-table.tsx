import React from 'react';

import { styled } from './read-only-details-table.styles';
import { type Props, type ReadOnlyDetailsTableRow } from './read-only-details-table.types';

const DEFAULT_EMPTY_VALUE = '-';

export default function ReadOnlyDetailsTable({
  rows,
  emptyValue = DEFAULT_EMPTY_VALUE,
  ariaLabel = 'Details table',
}: Props) {
  const visibleRows = rows.filter((row) => !row.hide);

  return (
    <styled.Table aria-label={ariaLabel}>
      <tbody>
        {visibleRows.map((row, index) => (
          <styled.Row key={row.key ?? getRowKey(row, index)}>
            <styled.LabelCell scope="row">{row.label}</styled.LabelCell>
            <styled.ValueCell>{getDisplayValue(row.value, emptyValue)}</styled.ValueCell>
          </styled.Row>
        ))}
      </tbody>
    </styled.Table>
  );
}

function getDisplayValue(
  value: ReadOnlyDetailsTableRow['value'],
  emptyValue: React.ReactNode
): React.ReactNode {
  if (value === null || value === undefined) {
    return emptyValue;
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return emptyValue;
  }

  return value;
}

function getRowKey(row: ReadOnlyDetailsTableRow, index: number): string {
  const labelText = typeof row.label === 'string' ? row.label : 'row';
  return `${labelText}-${index}`;
}
