import { type ScheduleDetailsTableRow } from '@/views/schedule-details/schedule-details-table/schedule-details-table.types';

import {
  type ScheduleDetailRowConfig,
  type FormattedScheduleDetails,
} from '../schedule-details.types';

export function getRowsFromConfig(
  config: ScheduleDetailRowConfig[],
  formattedScheduleDetails: FormattedScheduleDetails,
  scheduleId: string
): ScheduleDetailsTableRow[] {
  const args = { formattedScheduleDetails, scheduleId };
  return config
    .filter((rowConfig) => !rowConfig.hide || !rowConfig.hide(args))
    .map((rowConfig) => ({
      key: rowConfig.key,
      label: rowConfig.getLabel(),
      value: rowConfig.getValue(args),
    }));
}
