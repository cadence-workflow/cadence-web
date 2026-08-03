import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/schedule-details/schedule-details.constants';

import getOldestLoadedScheduleTimeMs from '../get-oldest-loaded-schedule-time-ms';

function withScheduleTime(scheduledTimeMs: number) {
  return getMockWorkflowListItem({
    searchAttributes: {
      [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]:
        scheduleTimeAttribute(scheduledTimeMs),
    },
  });
}

describe(getOldestLoadedScheduleTimeMs.name, () => {
  it('returns the earliest CadenceScheduleTime across all loaded pages', () => {
    const oldestMs = getOldestLoadedScheduleTimeMs({
      pages: [
        { workflows: [withScheduleTime(2000)], nextPage: 'p2' },
        { workflows: [withScheduleTime(1000)], nextPage: '' },
      ],
      pageParams: [undefined, 'p2'],
    });

    expect(oldestMs).toBe(1000);
  });

  it('returns null when no pages have loaded or no time is parsable', () => {
    expect(getOldestLoadedScheduleTimeMs(undefined)).toBeNull();
    expect(
      getOldestLoadedScheduleTimeMs({
        pages: [{ workflows: [getMockWorkflowListItem({})], nextPage: '' }],
        pageParams: [undefined],
      })
    ).toBeNull();
  });
});

function scheduleTimeAttribute(scheduledTimeMs: number) {
  return {
    data: Buffer.from(
      JSON.stringify(new Date(scheduledTimeMs).toISOString())
    ).toString('base64'),
  };
}
