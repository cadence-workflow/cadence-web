import { type ScheduleListEntry } from '@/route-handlers/list-schedules/list-schedules.types';

import { type DomainSchedulesStatus } from '../domain-schedules.types';

export default function filterSchedules({
  schedules,
  search,
  status,
}: {
  schedules: Array<ScheduleListEntry>;
  search?: string;
  status?: DomainSchedulesStatus;
}): Array<ScheduleListEntry> {
  let filtered = schedules;

  if (status === 'PAUSED') {
    filtered = filtered.filter((s) => Boolean(s.state?.paused));
  } else if (status === 'RUNNING') {
    filtered = filtered.filter((s) => !s.state?.paused);
  }

  const trimmedSearch = search?.trim().toLowerCase();
  if (trimmedSearch) {
    filtered = filtered.filter((s) => {
      const scheduleId = s.scheduleId?.toLowerCase() ?? '';
      const workflowTypeName = s.workflowType?.name?.toLowerCase() ?? '';
      return (
        scheduleId.includes(trimmedSearch) ||
        workflowTypeName.includes(trimmedSearch)
      );
    });
  }

  return filtered;
}
