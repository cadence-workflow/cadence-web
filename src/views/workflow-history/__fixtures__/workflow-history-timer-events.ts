import type { TimerHistoryEvent } from '../workflow-history.types';

export const startTimerTaskEvent = {
  eventId: '16',
  eventTime: {
    seconds: '1725748370',
    nanos: 632072806,
  },
  version: '575102',
  taskId: '12690929026',
  timerStartedEventAttributes: {
    timerId: '0',
    startToFireTimeout: {
      seconds: '5',
      nanos: 0,
    },
    decisionTaskCompletedEventId: '4',
  },
  attributes: 'timerStartedEventAttributes',
} as const satisfies TimerHistoryEvent;

export const fireTimerTaskEvent = {
  eventId: '17',
  eventTime: {
    seconds: '1725748470',
    nanos: 5167157,
  },
  version: '575102',
  taskId: '12690929027',
  timerFiredEventAttributes: {
    timerId: '0',
    startedEventId: '10',
  },
  attributes: 'timerFiredEventAttributes',
} as const satisfies TimerHistoryEvent;

export const cancelTimerTaskEvent = {
  eventId: '18',
  eventTime: {
    seconds: '1725748670',
    nanos: 860748144,
  },
  version: '575102',
  taskId: '12690929028',
  timerCanceledEventAttributes: {
    timerId: '0',
    startedEventId: '5',
    decisionTaskCompletedEventId: '9',
    identity: '67b17b8c-fc30-4c5c-ac7e-bc3046311b18',
  },
  attributes: 'timerCanceledEventAttributes',
} as const satisfies TimerHistoryEvent;

export const cancelTimerTaskEvents: TimerHistoryEvent[] = [
  startTimerTaskEvent,
  cancelTimerTaskEvent,
];

export const firedActivityTaskEvents: TimerHistoryEvent[] = [
  startTimerTaskEvent,
  fireTimerTaskEvent,
];
