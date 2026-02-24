import {
  localActivityMarkerEvent,
  failedLocalActivityMarkerEvent,
  createLocalActivityEvent,
} from '../../../__fixtures__/workflow-history-local-activity-events';
import * as shortenGroupLabelsConfigModule from '../../../config/workflow-history-should-shorten-group-labels.config';
import type { LocalActivityHistoryEvent } from '../../../workflow-history-v2.types';
import getLocalActivityGroupFromEvents from '../get-local-activity-group-from-events';

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

jest.mock(
  '../../../config/workflow-history-should-shorten-group-labels.config',
  () => ({
    __esModule: true,
    get default() {
      return false;
    },
  })
);

describe(getLocalActivityGroupFromEvents.name, () => {
  it('should return a group with a correct label', () => {
    const events: LocalActivityHistoryEvent[] = [localActivityMarkerEvent];

    const expectedLabel = 'Local Activity 1: localActivity';

    const group = getLocalActivityGroupFromEvents(events);

    expect(group.label).toBe(expectedLabel);
  });

  it('should return a group with hasMissingEvents set to false', () => {
    const events: LocalActivityHistoryEvent[] = [localActivityMarkerEvent];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.hasMissingEvents).toBe(false);
  });

  it('should return a group with groupType equal to LocalActivity', () => {
    const events: LocalActivityHistoryEvent[] = [localActivityMarkerEvent];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.groupType).toBe('LocalActivity');
  });

  it('should return group eventsMetadata with correct label for completed activity', () => {
    const events: LocalActivityHistoryEvent[] = [localActivityMarkerEvent];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Completed',
    ]);
  });

  it('should return group eventsMetadata with correct status for completed activity', () => {
    const events: LocalActivityHistoryEvent[] = [localActivityMarkerEvent];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
    ]);
  });

  it('should return group eventsMetadata with correct timeLabel', () => {
    const events: LocalActivityHistoryEvent[] = [localActivityMarkerEvent];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Completed at 27 Aug, 08:33:35 UTC',
    ]);
  });

  it('should include summaryFields for local activity events', () => {
    const events: LocalActivityHistoryEvent[] = [localActivityMarkerEvent];
    const group = getLocalActivityGroupFromEvents(events);

    const eventMetadata = group.eventsMetadata[0];
    expect(eventMetadata.summaryFields).toEqual(['attempt', 'reason']);
  });

  it('should return group eventsMetadata with Failed label for failed activity', () => {
    const events: LocalActivityHistoryEvent[] = [
      failedLocalActivityMarkerEvent,
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual(['Failed']);
  });

  it('should return group eventsMetadata with FAILED status for failed activity', () => {
    const events: LocalActivityHistoryEvent[] = [
      failedLocalActivityMarkerEvent,
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ status }) => status)).toEqual([
      'FAILED',
    ]);
  });

  it('should include details in negativeFields for failed activity', () => {
    const events: LocalActivityHistoryEvent[] = [
      failedLocalActivityMarkerEvent,
    ];
    const group = getLocalActivityGroupFromEvents(events);

    const eventMetadata = group.eventsMetadata[0];
    expect(eventMetadata.negativeFields).toContain('details');
    expect(eventMetadata.negativeFields).toContain('reason');
  });

  it('should return fallback label when details is null', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(null),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.label).toBe('Local Activity');
  });

  it('should return fallback label when details is undefined', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(undefined),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.label).toBe('Local Activity');
  });

  it('should return fallback label when details.data is not valid base64', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent({ data: '!!!not-valid-base64!!!' }),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.label).toBe('Local Activity');
  });

  it('should return fallback label when details.data is not valid JSON', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent({
        data: Buffer.from('not json').toString('base64'),
      }),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.label).toBe('Local Activity');
  });

  it('should return fallback label when activityId is missing', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent({
        data: Buffer.from(
          JSON.stringify({ activityType: 'someActivity' })
        ).toString('base64'),
      }),
    ];

    const group = getLocalActivityGroupFromEvents(events);
    expect(group.label).toBe('Local Activity');
  });

  it('should return fallback label when activityType is missing', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent({
        data: Buffer.from(JSON.stringify({ activityId: '1' })).toString(
          'base64'
        ),
      }),
    ];

    const group = getLocalActivityGroupFromEvents(events);
    expect(group.label).toBe('Local Activity');
  });

  it('should return fallback label when details is an empty object', () => {
    const events: LocalActivityHistoryEvent[] = [createLocalActivityEvent({})];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.label).toBe('Local Activity');
  });

  it('should still return COMPLETED status when details parsing fails', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(null),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.eventsMetadata[0].status).toBe('COMPLETED');
  });

  it('should return undefined shortLabel when details parsing fails', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(null),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.shortLabel).toBeUndefined();
  });

  it('should return fallback label when header.fields.LocalActivityHeader is also invalid', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(null, { fields: { LocalActivityHeader: null } }),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.label).toBe('Local Activity');
  });

  it('should parse activity metadata from headers when details is null', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(null, {
        activityId: '5',
        activityType: 'javaLocalActivity',
      }),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.label).toBe('Local Activity 5: javaLocalActivity');
  });

  it('should include attempt in additional details when present in headers', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(null, {
        activityId: '5',
        activityType: 'javaLocalActivity',
        attempt: 3,
      }),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.eventsMetadata[0].additionalDetails?.attempt).toBe(3);
  });

  it('should return FAILED status when errReason is set in headers', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(null, {
        activityId: '5',
        activityType: 'javaLocalActivity',
        errReason: 'activity timed out',
      }),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.eventsMetadata[0].status).toBe('FAILED');
    expect(group.eventsMetadata[0].label).toBe('Failed');
  });

  it('should include reason in additional details when errReason is set in headers', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(null, {
        activityId: '5',
        activityType: 'javaLocalActivity',
        errReason: 'activity timed out',
      }),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.eventsMetadata[0].additionalDetails?.reason).toBe(
      'activity timed out'
    );
  });

  it('should use headers over details when both are provided', () => {
    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(
        {
          result: 'success',
        },
        { activityId: '99', activityType: 'headerActivity' }
      ),
    ];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.label).toBe('Local Activity 99: headerActivity');
  });

  it('should generate shortLabel when activityType in headers contains dots', () => {
    jest
      .spyOn(shortenGroupLabelsConfigModule, 'default', 'get')
      .mockReturnValueOnce(true);

    const events: LocalActivityHistoryEvent[] = [
      createLocalActivityEvent(null, {
        activityId: '5',
        activityType: 'com.uber.cadence.SomeLocalActivity',
      }),
    ];

    const group = getLocalActivityGroupFromEvents(events);
    expect(group.shortLabel).toBe('Local Activity 5: SomeLocalActivity');
  });
});
