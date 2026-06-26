import { type ScheduleDetailsTableRow } from '../schedule-details-table.types';

export default function getRowKey(
  row: ScheduleDetailsTableRow,
  index: number
): string {
  const labelText = typeof row.label === 'string' ? row.label : 'row';
  return `${labelText}-${index}`;
}
