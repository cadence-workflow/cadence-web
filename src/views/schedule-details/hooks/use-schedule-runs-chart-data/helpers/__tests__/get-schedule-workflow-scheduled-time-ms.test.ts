import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule.constants';

import getScheduleWorkflowScheduledTimeMs from '../get-schedule-workflow-scheduled-time-ms';

describe(getScheduleWorkflowScheduledTimeMs.name, () => {
  it('prefers the CadenceScheduleTime search attribute', () => {
    const workflow = getMockWorkflowListItem({
      startTime: 1000,
      searchAttributes: {
        // Base64 of the JSON-encoded string "2000", matching how Cadence
        // visibility search attributes are actually encoded on the wire.
        [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: { data: 'IjIwMDAi' },
      },
    });

    expect(getScheduleWorkflowScheduledTimeMs(workflow)).toBe(2000);
  });

  it('falls back to startTime when the search attribute is missing', () => {
    const workflow = getMockWorkflowListItem({ startTime: 1000 });

    expect(getScheduleWorkflowScheduledTimeMs(workflow)).toBe(1000);
  });

  it('returns null when neither is available', () => {
    const workflow = getMockWorkflowListItem({
      startTime: Number.NaN,
    });

    expect(getScheduleWorkflowScheduledTimeMs(workflow)).toBeNull();
  });
});
