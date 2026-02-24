import {
  localActivityMarkerEvent,
  failedLocalActivityMarkerEvent,
} from '../../../__fixtures__/workflow-history-local-activity-events';
import type { LocalActivityHistoryEvent } from '../../../workflow-history-v2.types';
import getLocalActivityGroupFromEvents from '../get-local-activity-group-from-events';

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

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
});
