import { localActivityMarkerEvent } from '../../../__fixtures__/workflow-history-local-activity-events';
import { recordMarkerExecutionEvent } from '../../../__fixtures__/workflow-history-single-events';
import isLocalActivityEvent from '../is-local-activity-event';

describe(isLocalActivityEvent.name, () => {
  it('should return true for local activity marker events', () => {
    expect(isLocalActivityEvent(localActivityMarkerEvent)).toBe(true);
  });

  it('should return false for non-local-activity marker events (like Version markers)', () => {
    expect(isLocalActivityEvent(recordMarkerExecutionEvent)).toBe(false);
  });

  it('should return false for non-marker events', () => {
    expect(
      isLocalActivityEvent({
        attributes: 'activityTaskScheduledEventAttributes',
      })
    ).toBe(false);
  });

  it('should return false for marker events without markerName', () => {
    expect(
      isLocalActivityEvent({
        attributes: 'markerRecordedEventAttributes',
        markerRecordedEventAttributes: {},
      })
    ).toBe(false);
  });

  it('should return false for null, undefined, or missing attributes', () => {
    //@ts-expect-error null is not of type event
    expect(isLocalActivityEvent(null)).toBe(false);
    //@ts-expect-error undefined is not of type event
    expect(isLocalActivityEvent(undefined)).toBe(false);
    //@ts-expect-error {} is not of type event
    expect(isLocalActivityEvent({})).toBe(false);
  });
});
