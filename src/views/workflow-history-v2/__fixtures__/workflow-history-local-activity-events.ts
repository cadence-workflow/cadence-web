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
      data: 'eyJhY3Rpdml0eUlkIjoiMiIsImFjdGl2aXR5VHlwZSI6ImZhaWxpbmdBY3Rpdml0eSIsImVyclJlYXNvbiI6ImFjdGl2aXR5IGZhaWxlZCB3aXRoIGVycm9yIn0=',
    },
    decisionTaskCompletedEventId: '9',
    header: null,
  },
  attributes: 'markerRecordedEventAttributes',
} as const satisfies LocalActivityHistoryEvent;
