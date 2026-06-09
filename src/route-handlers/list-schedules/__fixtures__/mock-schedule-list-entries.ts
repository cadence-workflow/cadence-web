import { type ScheduleListEntry } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleListEntry';

export function getMockScheduleListEntry(
  overrides: Partial<ScheduleListEntry> = {}
): ScheduleListEntry {
  return {
    scheduleId: 'mock-schedule-id',
    workflowType: { name: 'mock-workflow-type' },
    state: { paused: false, pauseInfo: null },
    cronExpression: '0 * * * *',
    ...overrides,
  };
}
