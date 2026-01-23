import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
  mockTimerEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import { type TimelineRow } from '../../workflow-history-timeline.types';
import getTimelineMaxTimeMs from '../get-timeline-max-time-ms';

const mockNow = new Date('2024-01-15T10:00:00Z').getTime();
jest.useFakeTimers({ now: mockNow });

describe(getTimelineMaxTimeMs.name, () => {
  it('should return workflowCloseTimeMs when it is not null or undefined', () => {
    const workflowCloseTimeMs = mockNow - 60000; // 1 minute before now
    const timelineRows: Array<TimelineRow> = [
      {
        id: '1',
        label: 'Test',
        startTimeMs: mockNow,
        endTimeMs: mockNow + 1000, // 1 second after now
        groupType: 'ACTIVITY',
        status: 'COMPLETED',
        group: mockActivityEventGroup,
      },
    ];

    const result = getTimelineMaxTimeMs(workflowCloseTimeMs, timelineRows);

    expect(result).toBe(workflowCloseTimeMs);
  });

  it('should return workflowCloseTimeMs when it is 0', () => {
    const workflowCloseTimeMs = 0;
    const timelineRows: Array<TimelineRow> = [];

    const result = getTimelineMaxTimeMs(workflowCloseTimeMs, timelineRows);

    expect(result).toBe(0);
  });

  it('should return current time when workflowCloseTimeMs is null and timelineRows is empty', () => {
    const result = getTimelineMaxTimeMs(null, []);

    expect(result).toBe(mockNow);
  });

  it('should return current time when workflowCloseTimeMs is undefined and timelineRows is empty', () => {
    const result = getTimelineMaxTimeMs(undefined, []);

    expect(result).toBe(mockNow);
  });

  it('should return current time when timelineRows has one row with endTimeMs less than current time', () => {
    const timelineRows: Array<TimelineRow> = [
      {
        id: '1',
        label: 'Test',
        startTimeMs: mockNow - 5000, // 5 seconds before now
        endTimeMs: mockNow - 1000, // 1 second before now
        groupType: 'ACTIVITY',
        status: 'COMPLETED',
        group: mockActivityEventGroup,
      },
    ];

    const result = getTimelineMaxTimeMs(null, timelineRows);

    expect(result).toBe(mockNow);
  });

  it('should return maxRowEndTime when timelineRows has one row with endTimeMs greater than current time', () => {
    const futureTime = mockNow + 5000; // 5 seconds after now
    const timelineRows: Array<TimelineRow> = [
      {
        id: '1',
        label: 'Test',
        startTimeMs: mockNow,
        endTimeMs: futureTime,
        groupType: 'ACTIVITY',
        status: 'COMPLETED',
        group: mockActivityEventGroup,
      },
    ];

    const result = getTimelineMaxTimeMs(null, timelineRows);

    expect(result).toBe(futureTime);
  });

  it('should return max endTimeMs from multiple timelineRows when it is greater than current time', () => {
    const maxEndTime = mockNow + 10000; // 10 seconds after now
    const timelineRows: Array<TimelineRow> = [
      {
        id: '1',
        label: 'Test 1',
        startTimeMs: mockNow - 5000, // 5 seconds before now
        endTimeMs: mockNow - 1000, // 1 second before now
        groupType: 'ACTIVITY',
        status: 'COMPLETED',
        group: mockActivityEventGroup,
      },
      {
        id: '2',
        label: 'Test 2',
        startTimeMs: mockNow,
        endTimeMs: maxEndTime,
        groupType: 'DECISION',
        status: 'COMPLETED',
        group: mockDecisionEventGroup,
      },
      {
        id: '3',
        label: 'Test 3',
        startTimeMs: mockNow - 3000, // 3 seconds before now
        endTimeMs: mockNow + 5000, // 5 seconds after now
        groupType: 'TIMER',
        status: 'COMPLETED',
        group: mockTimerEventGroup,
      },
    ];

    const result = getTimelineMaxTimeMs(null, timelineRows);

    expect(result).toBe(maxEndTime);
  });

  it('should return current time when max endTimeMs from timelineRows is less than current time', () => {
    const timelineRows: Array<TimelineRow> = [
      {
        id: '1',
        label: 'Test 1',
        startTimeMs: mockNow - 10000, // 10 seconds before now
        endTimeMs: mockNow - 5000, // 5 seconds before now
        groupType: 'ACTIVITY',
        status: 'COMPLETED',
        group: mockActivityEventGroup,
      },
      {
        id: '2',
        label: 'Test 2',
        startTimeMs: mockNow - 8000, // 8 seconds before now
        endTimeMs: mockNow - 2000, // 2 seconds before now
        groupType: 'DECISION',
        status: 'COMPLETED',
        group: mockDecisionEventGroup,
      },
    ];

    const result = getTimelineMaxTimeMs(null, timelineRows);

    expect(result).toBe(mockNow);
  });
});
