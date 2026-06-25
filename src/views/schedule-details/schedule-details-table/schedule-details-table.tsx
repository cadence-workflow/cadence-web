import getDisplayValue from './helpers/get-display-value';
import getRowKey from './helpers/get-row-key';
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
    <styled.Table aria-label={ariaLabel}>
      <tbody>
        {visibleRows.map((row, index) => (
          <styled.Row key={row.key ?? getRowKey(row, index)}>
            <styled.LabelCell scope="row">{row.label}</styled.LabelCell>
            <styled.ValueCell>
              {getDisplayValue(row.value, emptyValue)}
            </styled.ValueCell>
          </styled.Row>
        ))}
      </tbody>
    </styled.Table>
  );
}
