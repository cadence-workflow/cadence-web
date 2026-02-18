import formatPendingWorkflowHistoryEvent from '@/utils/data-formatters/format-pending-workflow-history-event';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';
import {
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
  completeActivityTaskEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-activity-events';
import { mockActivityEventGroup } from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import { pendingActivityTaskStartEvent } from '@/views/workflow-history/__fixtures__/workflow-history-pending-events';
import isPendingHistoryEvent from '@/views/workflow-history/workflow-history-event-details/helpers/is-pending-history-event';

import { type HistoryEventsGroup } from '../../workflow-history-v2.types';
import generateHistoryEventDetails from '../generate-history-event-details';
import generateHistoryGroupDetails from '../generate-history-group-details';

jest.mock('@/utils/data-formatters/format-pending-workflow-history-event');
jest.mock('@/utils/data-formatters/format-workflow-history-event');
jest.mock(
  '@/views/workflow-history/workflow-history-event-details/helpers/is-pending-history-event'
);
jest.mock('../generate-history-event-details');

const mockedFormatPendingWorkflowHistoryEvent =
  formatPendingWorkflowHistoryEvent as jest.Mock;
const mockedFormatWorkflowHistoryEvent =
  formatWorkflowHistoryEvent as jest.Mock;
const mockedIsPendingHistoryEvent =
  isPendingHistoryEvent as unknown as jest.Mock;
const mockedGenerateHistoryEventDetails =
  generateHistoryEventDetails as jest.Mock;

describe(generateHistoryGroupDetails.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedIsPendingHistoryEvent.mockReturnValue(false);
    mockedFormatWorkflowHistoryEvent.mockReturnValue({
      activityId: '0',
      activityType: 'TestActivity',
      input: 'test input',
    });
    mockedFormatPendingWorkflowHistoryEvent.mockReturnValue({
      activityId: '0',
      activityType: 'TestActivity',
    });
    mockedGenerateHistoryEventDetails.mockReturnValue([
      {
        key: 'activityId',
        path: 'activityId',
        value: '0',
        isGroup: false,
        renderConfig: null,
      },
      {
        key: 'activityType',
        path: 'activityType',
        value: 'TestActivity',
        isGroup: false,
        renderConfig: null,
      },
    ]);
  });

  it('should return empty arrays when eventGroup has no events', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [],
      eventsMetadata: [],
    };

    const result = generateHistoryGroupDetails(eventGroup);

    expect(result.groupDetailsEntries).toEqual([]);
    expect(result.summaryDetailsEntries).toEqual([]);
  });

  it('should generate group details entries for events with eventId and metadata', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [
        scheduleActivityTaskEvent,
        { ...startActivityTaskEvent, eventId: '8' },
      ],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
        },
        {
          label: 'Started',
          status: 'COMPLETED',
          timeMs: 1725747370612,
          timeLabel: 'Started at 07 Sep, 22:16:10 UTC',
        },
      ],
    };

    const result = generateHistoryGroupDetails(eventGroup);

    expect(result.groupDetailsEntries).toHaveLength(2);
    expect(result.groupDetailsEntries[0][0]).toBe('7');
    expect(result.groupDetailsEntries[0][1].eventLabel).toBe('Scheduled');
    expect(result.groupDetailsEntries[1][0]).toBe('8');
    expect(result.groupDetailsEntries[1][1].eventLabel).toBe('Started');
    expect(mockedFormatWorkflowHistoryEvent).toHaveBeenCalledTimes(2);
    expect(mockedGenerateHistoryEventDetails).toHaveBeenCalledTimes(2);
  });

  it('should skip events without corresponding metadata', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [
        scheduleActivityTaskEvent,
        { ...startActivityTaskEvent, eventId: '8' },
      ],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
        },
      ],
    };

    const result = generateHistoryGroupDetails(eventGroup);

    expect(result.groupDetailsEntries).toHaveLength(1);
    expect(result.groupDetailsEntries[0][0]).toBe('7');
    expect(mockedFormatWorkflowHistoryEvent).toHaveBeenCalledTimes(1);
  });

  it('should use formatPendingWorkflowHistoryEvent for pending events', () => {
    mockedIsPendingHistoryEvent
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [scheduleActivityTaskEvent, pendingActivityTaskStartEvent],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
        },
        {
          label: 'Pending',
          status: 'WAITING',
          timeMs: null,
          timeLabel: 'Pending',
        },
      ],
    };

    const result = generateHistoryGroupDetails(eventGroup);

    expect(result.groupDetailsEntries).toHaveLength(2);
    expect(mockedIsPendingHistoryEvent).toHaveBeenCalled();
    expect(mockedFormatPendingWorkflowHistoryEvent).toHaveBeenCalledTimes(1);
    expect(mockedFormatWorkflowHistoryEvent).toHaveBeenCalledTimes(1);
  });

  it('should use formatWorkflowHistoryEvent for non-pending events', () => {
    mockedIsPendingHistoryEvent.mockReturnValue(false);

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [scheduleActivityTaskEvent],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
        },
      ],
    };

    const result = generateHistoryGroupDetails(eventGroup);

    expect(result.groupDetailsEntries).toHaveLength(1);
    expect(mockedIsPendingHistoryEvent).toHaveBeenCalled();
    expect(mockedFormatWorkflowHistoryEvent).toHaveBeenCalledTimes(1);
    expect(mockedFormatPendingWorkflowHistoryEvent).not.toHaveBeenCalled();
  });

  it('should merge additionalDetails from metadata into formatted event details', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [scheduleActivityTaskEvent],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
          additionalDetails: {
            customField: 'custom value',
          },
        },
      ],
    };

    generateHistoryGroupDetails(eventGroup);

    expect(mockedGenerateHistoryEventDetails).toHaveBeenCalledWith({
      details: {
        activityId: '0',
        activityType: 'TestActivity',
        input: 'test input',
        customField: 'custom value',
      },
      negativeFields: undefined,
    });
  });

  it('should pass negativeFields from metadata to generateHistoryEventDetails', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [scheduleActivityTaskEvent],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
          negativeFields: ['error', 'failureReason'],
        },
      ],
    };

    generateHistoryGroupDetails(eventGroup);

    expect(mockedGenerateHistoryEventDetails).toHaveBeenCalledWith({
      details: {
        activityId: '0',
        activityType: 'TestActivity',
        input: 'test input',
      },
      negativeFields: ['error', 'failureReason'],
    });
  });

  it('should generate summary details entries when summaryFields match event details', () => {
    mockedGenerateHistoryEventDetails.mockReturnValue([
      {
        key: 'activityId',
        path: 'activityId',
        value: '0',
        isGroup: false,
        renderConfig: null,
      },
      {
        key: 'activityType',
        path: 'activityType',
        value: 'TestActivity',
        isGroup: false,
        renderConfig: null,
      },
      {
        key: 'input',
        path: 'input',
        value: 'test input',
        isGroup: false,
        renderConfig: null,
      },
    ]);

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [scheduleActivityTaskEvent],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
          summaryFields: ['activityId', 'activityType'],
        },
      ],
    };

    const result = generateHistoryGroupDetails(eventGroup);

    expect(result.summaryDetailsEntries).toHaveLength(1);
    expect(result.summaryDetailsEntries[0][0]).toBe('7');
    expect(result.summaryDetailsEntries[0][1].eventLabel).toBe('Scheduled');
    expect(result.summaryDetailsEntries[0][1].eventDetails).toHaveLength(2);
    expect(result.summaryDetailsEntries[0][1].eventDetails[0].path).toBe(
      'activityId'
    );
    expect(result.summaryDetailsEntries[0][1].eventDetails[1].path).toBe(
      'activityType'
    );
  });

  it('should not generate summary details entries when summaryFields do not match any event details', () => {
    mockedGenerateHistoryEventDetails.mockReturnValue([
      {
        key: 'activityId',
        path: 'activityId',
        value: '0',
        isGroup: false,
        renderConfig: null,
      },
    ]);

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [scheduleActivityTaskEvent],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
          summaryFields: ['nonExistentField'],
        },
      ],
    };

    const result = generateHistoryGroupDetails(eventGroup);

    expect(result.summaryDetailsEntries).toHaveLength(0);
  });

  it('should not generate summary details entries when summaryFields is not provided', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [scheduleActivityTaskEvent],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
        },
      ],
    };

    const result = generateHistoryGroupDetails(eventGroup);

    expect(result.summaryDetailsEntries).toHaveLength(0);
  });

  it('should handle events where formatWorkflowHistoryEvent returns null', () => {
    mockedFormatWorkflowHistoryEvent.mockReturnValue(null);

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [scheduleActivityTaskEvent],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
        },
      ],
    };

    const result = generateHistoryGroupDetails(eventGroup);

    expect(result.groupDetailsEntries).toHaveLength(1);
    expect(result.groupDetailsEntries[0][1].eventDetails).toEqual([]);
    expect(mockedGenerateHistoryEventDetails).not.toHaveBeenCalled();
  });

  it('should handle multiple events with mixed summaryFields', () => {
    mockedGenerateHistoryEventDetails.mockReturnValue([
      {
        key: 'activityId',
        path: 'activityId',
        value: '0',
        isGroup: false,
        renderConfig: null,
      },
      {
        key: 'activityType',
        path: 'activityType',
        value: 'TestActivity',
        isGroup: false,
        renderConfig: null,
      },
      {
        key: 'result',
        path: 'result',
        value: 'success',
        isGroup: false,
        renderConfig: null,
      },
    ]);

    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [
        scheduleActivityTaskEvent,
        { ...startActivityTaskEvent, eventId: '8' },
        { ...completeActivityTaskEvent, eventId: '9' },
      ],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
          summaryFields: ['activityId'],
        },
        {
          label: 'Started',
          status: 'COMPLETED',
          timeMs: 1725747370612,
          timeLabel: 'Started at 07 Sep, 22:16:10 UTC',
          summaryFields: ['activityType'],
        },
        {
          label: 'Completed',
          status: 'COMPLETED',
          timeMs: 1725747370632,
          timeLabel: 'Completed at 07 Sep, 22:16:10 UTC',
          summaryFields: ['result'],
        },
      ],
    };

    const result = generateHistoryGroupDetails(eventGroup);

    expect(result.groupDetailsEntries).toHaveLength(3);
    expect(result.summaryDetailsEntries).toHaveLength(3);
    expect(result.summaryDetailsEntries[0][0]).toBe('7');
    expect(result.summaryDetailsEntries[1][0]).toBe('8');
    expect(result.summaryDetailsEntries[2][0]).toBe('9');
  });

  it('should handle events with both additionalDetails and negativeFields', () => {
    const eventGroup: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [scheduleActivityTaskEvent],
      eventsMetadata: [
        {
          label: 'Scheduled',
          status: 'COMPLETED',
          timeMs: 1725747370599,
          timeLabel: 'Scheduled at 07 Sep, 22:16:10 UTC',
          additionalDetails: {
            customField: 'custom value',
          },
          negativeFields: ['error'],
        },
      ],
    };

    generateHistoryGroupDetails(eventGroup);

    expect(mockedGenerateHistoryEventDetails).toHaveBeenCalledWith({
      details: {
        activityId: '0',
        activityType: 'TestActivity',
        input: 'test input',
        customField: 'custom value',
      },
      negativeFields: ['error'],
    });
  });
});
