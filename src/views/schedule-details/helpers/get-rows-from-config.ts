import { type ScheduleDetailsTableRow } from '@/views/schedule-details/schedule-details-table/schedule-details-table.types';

import {
  type ScheduleDetailRowConfig,
  type ScheduleDetailRowArgs,
} from '../schedule-details.types';

export function getRowsFromConfig(
  config: ScheduleDetailRowConfig[],
  data: ScheduleDetailRowArgs['describeSchedule'],
  scheduleId: string
): ScheduleDetailsTableRow[] {
  const args = { describeSchedule: data, scheduleId };
  return config
    .filter(
      (rowConfig) =>
        !rowConfig.hide ||
        !rowConfig.hide({ describeSchedule: data, scheduleId })
    )
    .map((rowConfig) => ({
      key: rowConfig.key,
      label: rowConfig.getLabel(),
      value: rowConfig.getValue(args),
    }));
}
