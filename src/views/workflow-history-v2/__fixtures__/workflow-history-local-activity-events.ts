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
      data: 'eyJhY3Rpdml0eUlkIjoiMSIsImFjdGl2aXR5VHlwZSI6ImxvY2FsQWN0aXZpdHkiLCJyZXN1bHQiOiJzdWNjZXNzIn0=',
    },
    decisionTaskCompletedEventId: '9',
    header: null,
  },
  attributes: 'markerRecordedEventAttributes',
} as const satisfies LocalActivityHistoryEvent;
