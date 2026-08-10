import type React from 'react';

import { type ScheduleDetailsTableRow } from '../schedule-details-table.types';

export default function getDisplayValue(
  value: ScheduleDetailsTableRow['value'],
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
