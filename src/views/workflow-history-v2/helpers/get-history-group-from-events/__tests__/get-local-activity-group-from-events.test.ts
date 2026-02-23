import { localActivityMarkerEvent } from '../../../__fixtures__/workflow-history-local-activity-events';
import type { LocalActivityHistoryEvent } from '../../../workflow-history-v2.types';
import getLocalActivityGroupFromEvents from '../get-local-activity-group-from-events';

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

describe(getLocalActivityGroupFromEvents.name, () => {
  it('should return a group with a correct label', () => {
    const events: LocalActivityHistoryEvent[] = [localActivityMarkerEvent];

    const expectedLabel = `Local Activity: ${localActivityMarkerEvent.markerRecordedEventAttributes?.markerName}`;

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

  it('should return group eventsMetadata with correct label', () => {
    const events: LocalActivityHistoryEvent[] = [localActivityMarkerEvent];
    const group = getLocalActivityGroupFromEvents(events);
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Recorded',
    ]);
  });

  it('should return group eventsMetadata with correct status', () => {
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
      'Recorded at 27 Aug, 08:33:35 UTC',
    ]);
  });

  it('should include summaryFields for local activity events', () => {
    const events: LocalActivityHistoryEvent[] = [localActivityMarkerEvent];
    const group = getLocalActivityGroupFromEvents(events);

    const eventMetadata = group.eventsMetadata[0];
    expect(eventMetadata.summaryFields).toEqual(['details']);
  });
});
