import type { LocalActivityHistoryEvent } from '../workflow-history-v2.types';

export const localActivityMarkerEvent = {
  eventId: '10',
  eventTime: {
    seconds: '1724747615',
    nanos: 549377718,
  },
  version: '575102',
  taskId: '22647173810',
  markerRecordedEventAttributes: {
    markerName: 'LocalActivity',
    details: {
      data: Buffer.from(
        JSON.stringify({
          activityId: '1',
          activityType: 'localActivity',
          result: 'success',
        })
      ).toString('base64'),
    },
    decisionTaskCompletedEventId: '9',
    header: null,
  },
  attributes: 'markerRecordedEventAttributes',
} as const satisfies LocalActivityHistoryEvent;

export const failedLocalActivityMarkerEvent = {
  eventId: '11',
  eventTime: {
    seconds: '1724747620',
    nanos: 549377718,
  },
  version: '575102',
  taskId: '22647173811',
  markerRecordedEventAttributes: {
    markerName: 'LocalActivity',
    details: {
      data: Buffer.from(
        JSON.stringify({
          activityId: '2',
          activityType: 'failingActivity',
          errReason: 'activity failed with error',
        })
      ).toString('base64'),
    },
    decisionTaskCompletedEventId: '9',
    header: null,
  },
  attributes: 'markerRecordedEventAttributes',
} as const satisfies LocalActivityHistoryEvent;

export function createLocalActivityEvent(
  details: unknown = null,
  header: unknown = null
): LocalActivityHistoryEvent {
  return {
    ...localActivityMarkerEvent,
    markerRecordedEventAttributes: {
      ...localActivityMarkerEvent.markerRecordedEventAttributes,
      ...(details !== undefined && {
        details: {
          data: Buffer.from(JSON.stringify(details)).toString('base64'),
        },
      }),
      ...(header !== undefined && {
        header: {
          fields: {
            LocalActivityHeader: {
              data: Buffer.from(JSON.stringify(header)).toString('base64'),
            },
          },
        },
      }),
    },
  };
}
