import {
  type TimerHistoryGroup,
  type ActivityHistoryGroup,
  type SingleEventHistoryGroup,
} from '../workflow-history.types';

import { completedActivityTaskEvents } from './workflow-history-activity-events';
import { startWorkflowExecutionEvent } from './workflow-history-single-events';
import { startTimerTaskEvent } from './workflow-history-timer-events';

export const mockActivityEventGroup: ActivityHistoryGroup = {
  label: 'Mock event',
  groupType: 'Activity',
  status: 'COMPLETED',
  eventsMetadata: [],
  hasMissingEvents: false,
  timeMs: 1725747380000,
  timeLabel: 'Mock time label',
  events: completedActivityTaskEvents,
};

export const mockTimerEventGroup: TimerHistoryGroup = {
  label: 'Mock event',
  groupType: 'Timer',
  status: 'COMPLETED',
  eventsMetadata: [],
  hasMissingEvents: false,
  timeMs: 1725747380000,
  timeLabel: 'Mock time label',
  events: [startTimerTaskEvent],
};

export const mockSingleEventGroup: SingleEventHistoryGroup = {
  label: 'Mock event',
  groupType: 'Event',
  status: 'COMPLETED',
  eventsMetadata: [],
  hasMissingEvents: false,
  timeMs: 1725747380000,
  timeLabel: 'Mock time label',
  events: [startWorkflowExecutionEvent],
};
