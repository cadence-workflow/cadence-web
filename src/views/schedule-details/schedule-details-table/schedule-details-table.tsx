import getDisplayValue from './helpers/get-display-value';
import {
  DEFAULT_ARIA_LABEL,
  DEFAULT_EMPTY_VALUE,
} from './schedule-details-table.constants';
import { styled } from './schedule-details-table.styles';
import { type Props } from './schedule-details-table.types';

export default function ScheduleDetailsTable({
  rows,
  emptyValue = DEFAULT_EMPTY_VALUE,
  ariaLabel = DEFAULT_ARIA_LABEL,
}: Props) {
  const visibleRows = rows.filter((row) => !row.hide);

  return (
    <styled.Container aria-label={ariaLabel} role="table">
      {visibleRows.map((row, index) => (
        <styled.Row
          key={
            row.key ??
            `${typeof row.label === 'string' ? row.label : 'row'}-${index}`
          }
          role="row"
        >
          <styled.Label role="rowheader">{row.label}</styled.Label>
          <styled.Value role="cell">
            {getDisplayValue(row.value, emptyValue)}
          </styled.Value>
        </styled.Row>
      ))}
    </styled.Container>
  );
}
