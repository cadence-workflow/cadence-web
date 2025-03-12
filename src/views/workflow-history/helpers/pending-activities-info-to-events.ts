import { type PendingActivityInfo } from '@/__generated__/proto-ts/uber/cadence/api/v1/PendingActivityInfo';

import { type PendingActivityTaskStartEvent } from '../workflow-history.types';

export default function pendingActivitiesInfoToEvents(
  activities: PendingActivityInfo[]
): PendingActivityTaskStartEvent[] {
  const events = activities.map((activityInfo) => {
    switch (activityInfo.state) {
      case 'PENDING_ACTIVITY_STATE_SCHEDULED':
      case 'PENDING_ACTIVITY_STATE_STARTED':
        return {
          attributes: 'pendingActivityTaskStartEventAttributes',
          eventTime: activityInfo.lastStartedTime ?? activityInfo.scheduledTime,
          eventId: null,
          computedEventId: `Pending-${activityInfo.scheduleId}`,
          pendingActivityTaskStartEventAttributes: {
            ...activityInfo,
            state: activityInfo.state, // make it clear to ts that the state is start or scheduled (same as a typeguard)
          },
        } satisfies PendingActivityTaskStartEvent;
      default:
        return null;
    }
  });
  return events.filter((v): v is PendingActivityTaskStartEvent => v !== null);
}
