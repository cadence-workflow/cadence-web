import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import {
  mockActivityEventGroup,
  mockTimerEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import getTimelineRowFromEventGroup from '../get-timeline-row-from-event-group';

jest.mock(
  '../../../workflow-history-event-group/helpers/get-event-group-filtering-type',
  () => jest.fn(() => 'ACTIVITY')
);

const mockNow = new Date('2024-09-10').getTime();
jest.useFakeTimers({ now: mockNow });

describe(getTimelineRowFromEventGroup.name, () => {
  it('should return undefined when workflowStartTimeMs is null', () => {
    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      mockActivityEventGroup,
      null
    );

    expect(result).toBeUndefined();
  });

  it('should return a valid timeline row when workflowStartTimeMs is 0', () => {
    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      mockActivityEventGroup,
      0
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-group-id',
        label: mockActivityEventGroup.label,
        groupType: 'ACTIVITY',
        status: mockActivityEventGroup.status,
        group: mockActivityEventGroup,
      })
    );
  });

  it('should return undefined when group.events is empty', () => {
    const groupWithNoEvents = {
      ...mockActivityEventGroup,
      events: [],
    };

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      groupWithNoEvents,
      mockNow
    );

    expect(result).toBeUndefined();
  });

  it('should return undefined when first event has no eventTime', () => {
    const groupWithNoEventTime = {
      ...mockActivityEventGroup,
      events: [
        {
          ...mockActivityEventGroup.events[0],
          eventTime: null,
        },
      ],
    };

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      groupWithNoEventTime,
      mockNow
    );

    expect(result).toBeUndefined();
  });

  it('should return correct timeline row for completed activity group', () => {
    const workflowStartTimeMs = mockNow - 1000000; // 1000 seconds before now

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      mockActivityEventGroup,
      workflowStartTimeMs
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-group-id',
        label: mockActivityEventGroup.label,
        startTimeMs: expect.closeTo(
          parseGrpcTimestamp(mockActivityEventGroup.events[0].eventTime!),
          0
        ),
        endTimeMs: expect.closeTo(mockActivityEventGroup.timeMs!, 0),
        groupType: 'ACTIVITY',
        status: mockActivityEventGroup.status,
        group: mockActivityEventGroup,
      })
    );
  });

  it('should return current time as endTimeMs when group is ongoing and not a timer', () => {
    const ongoingGroup = {
      ...mockActivityEventGroup,
      status: 'ONGOING' as const,
      timeMs: null,
    };

    const workflowStartTimeMs = mockNow - 1000000;

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      ongoingGroup,
      workflowStartTimeMs
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-group-id',
        label: ongoingGroup.label,
        startTimeMs: expect.closeTo(
          parseGrpcTimestamp(ongoingGroup.events[0].eventTime!),
          0
        ),
        endTimeMs: expect.closeTo(mockNow, 0),
        groupType: 'ACTIVITY',
        status: 'ONGOING',
        group: ongoingGroup,
      })
    );
  });

  it('should return expectedEndTimeInfo.timeMs as endTimeMs for ongoing timer', () => {
    const ongoingTimerGroup = {
      ...mockTimerEventGroup,
      status: 'ONGOING' as const,
      timeMs: null,
      expectedEndTimeInfo: {
        timeMs: mockNow + 5000,
        prefix: 'Starts in',
      },
    };

    const workflowStartTimeMs = mockNow - 1000000;

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      ongoingTimerGroup,
      workflowStartTimeMs
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-group-id',
        label: ongoingTimerGroup.label,
        startTimeMs: expect.closeTo(
          parseGrpcTimestamp(ongoingTimerGroup.events[0].eventTime!),
          0
        ),
        endTimeMs: expect.closeTo(mockNow + 5000, 0),
        groupType: 'ACTIVITY',
        status: 'ONGOING',
        group: ongoingTimerGroup,
      })
    );
  });

  it('should return expectedEndTimeInfo.timeMs as endTimeMs for waiting timer', () => {
    const waitingTimerGroup = {
      ...mockTimerEventGroup,
      status: 'WAITING' as const,
      timeMs: null,
      expectedEndTimeInfo: {
        timeMs: mockNow + 10000,
        prefix: 'Starts in',
      },
    };

    const workflowStartTimeMs = mockNow - 1000000;

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      waitingTimerGroup,
      workflowStartTimeMs
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-group-id',
        label: waitingTimerGroup.label,
        startTimeMs: expect.closeTo(
          parseGrpcTimestamp(waitingTimerGroup.events[0].eventTime!),
          0
        ),
        endTimeMs: expect.closeTo(mockNow + 10000, 0),
        groupType: 'ACTIVITY',
        status: 'WAITING',
        group: waitingTimerGroup,
      })
    );
  });

  it('should return timeMs as endTimeMs for completed group', () => {
    const completedGroup = {
      ...mockActivityEventGroup,
      status: 'COMPLETED' as const,
      timeMs: mockNow - 5000,
    };

    const workflowStartTimeMs = mockNow - 1000000;

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      completedGroup,
      workflowStartTimeMs
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-group-id',
        label: completedGroup.label,
        startTimeMs: expect.closeTo(
          parseGrpcTimestamp(completedGroup.events[0].eventTime!),
          0
        ),
        endTimeMs: expect.closeTo(mockNow - 5000, 0),
        groupType: 'ACTIVITY',
        status: 'COMPLETED',
        group: completedGroup,
      })
    );
  });

  it('should return timeMs as endTimeMs for failed group', () => {
    const failedGroup = {
      ...mockActivityEventGroup,
      status: 'FAILED' as const,
      timeMs: mockNow - 3000,
    };

    const workflowStartTimeMs = mockNow - 1000000;

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      failedGroup,
      workflowStartTimeMs
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-group-id',
        label: failedGroup.label,
        startTimeMs: expect.closeTo(
          parseGrpcTimestamp(failedGroup.events[0].eventTime!),
          0
        ),
        endTimeMs: expect.closeTo(mockNow - 3000, 0),
        groupType: 'ACTIVITY',
        status: 'FAILED',
        group: failedGroup,
      })
    );
  });

  it('should return timeMs as endTimeMs for canceled group', () => {
    const canceledGroup = {
      ...mockActivityEventGroup,
      status: 'CANCELED' as const,
      timeMs: mockNow - 2000,
    };

    const workflowStartTimeMs = mockNow - 1000000;

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      canceledGroup,
      workflowStartTimeMs
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-group-id',
        label: canceledGroup.label,
        startTimeMs: expect.closeTo(
          parseGrpcTimestamp(canceledGroup.events[0].eventTime!),
          0
        ),
        endTimeMs: expect.closeTo(mockNow - 2000, 0),
        groupType: 'ACTIVITY',
        status: 'CANCELED',
        group: canceledGroup,
      })
    );
  });

  it('should return current time as endTimeMs when timer is ongoing but has no expectedEndTimeInfo', () => {
    const ongoingTimerWithoutExpectedEnd = {
      ...mockTimerEventGroup,
      status: 'ONGOING' as const,
      timeMs: null,
      expectedEndTimeInfo: undefined,
    };

    const workflowStartTimeMs = mockNow - 1000000;

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      ongoingTimerWithoutExpectedEnd,
      workflowStartTimeMs
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-group-id',
        label: ongoingTimerWithoutExpectedEnd.label,
        startTimeMs: expect.closeTo(
          parseGrpcTimestamp(
            ongoingTimerWithoutExpectedEnd.events[0].eventTime!
          ),
          0
        ),
        endTimeMs: expect.closeTo(mockNow, 0),
        groupType: 'ACTIVITY',
        status: 'ONGOING',
        group: ongoingTimerWithoutExpectedEnd,
      })
    );
  });

  it('should return current time as endTimeMs when timer is completed but has no timeMs', () => {
    const completedTimerWithoutTimeMs = {
      ...mockTimerEventGroup,
      status: 'COMPLETED' as const,
      timeMs: null,
    };

    const workflowStartTimeMs = mockNow - 1000000;

    const result = getTimelineRowFromEventGroup(
      'test-group-id',
      completedTimerWithoutTimeMs,
      workflowStartTimeMs
    );

    expect(result).toEqual(
      expect.objectContaining({
        id: 'test-group-id',
        label: completedTimerWithoutTimeMs.label,
        startTimeMs: expect.closeTo(
          parseGrpcTimestamp(completedTimerWithoutTimeMs.events[0].eventTime!),
          0
        ),
        endTimeMs: expect.closeTo(mockNow, 0),
        groupType: 'ACTIVITY',
        status: 'COMPLETED',
        group: completedTimerWithoutTimeMs,
      })
    );
  });
});
