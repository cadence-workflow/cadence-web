import {
  type TimerHistoryGroup,
  type ActivityHistoryGroup,
  type SingleEventHistoryGroup,
  type DecisionHistoryGroup,
  type ChildWorkflowExecutionHistoryGroup,
  type SignalExternalWorkflowExecutionHistoryGroup,
  type RequestCancelExternalWorkflowExecutionHistoryGroup,
  type WorkflowSignaledHistoryGroup,
} from '../workflow-history-v2.types';

import { completedActivityTaskEvents } from './workflow-history-activity-events';
import { completedChildWorkflowEvents } from './workflow-history-child-workflow-events';
import { completedDecisionTaskEvents } from './workflow-history-decision-events';
import { requestedCancelExternalWorkflowEvents } from './workflow-history-request-cancel-external-workflow-events';
import { signaledExternalWorkflowEvents } from './workflow-history-signal-external-workflow-events';
import { startWorkflowExecutionEvent } from './workflow-history-single-events';
import { startTimerTaskEvent } from './workflow-history-timer-events';
import { workflowSignaledEvents } from './workflow-history-workflow-signaled-events';

export const mockActivityEventGroup: ActivityHistoryGroup = {
  label: 'Mock event',
  groupType: 'Activity',
  status: 'COMPLETED',
  eventsMetadata: [],
  hasMissingEvents: false,
  timeMs: 1725747370632,
  startTimeMs: 1725747370599,
  timeLabel: 'Mock time label',
  events: completedActivityTaskEvents,
  firstEventId: completedActivityTaskEvents[0].eventId,
};

export const mockDecisionEventGroup: DecisionHistoryGroup = {
  label: 'Mock decision',
  groupType: 'Decision',
  status: 'COMPLETED',
  eventsMetadata: [],
  hasMissingEvents: false,
  timeMs: 1725747370632,
  startTimeMs: 1725747370599,
  timeLabel: 'Mock time label',
  events: completedDecisionTaskEvents,
  firstEventId: completedDecisionTaskEvents[0].eventId,
};

export const mockTimerEventGroup: TimerHistoryGroup = {
  label: 'Mock event',
  groupType: 'Timer',
  status: 'COMPLETED',
  eventsMetadata: [],
  hasMissingEvents: false,
  timeMs: 1725747380000,
  startTimeMs: 1725747380000,
  timeLabel: 'Mock time label',
  events: [startTimerTaskEvent],
  firstEventId: startTimerTaskEvent.eventId,
};

export const mockChildWorkflowEventGroup: ChildWorkflowExecutionHistoryGroup = {
  label: 'Mock child workflow',
  groupType: 'ChildWorkflowExecution',
  status: 'COMPLETED',
  eventsMetadata: [],
  hasMissingEvents: false,
  timeMs: 1725769674218,
  startTimeMs: 1725769671830,
  timeLabel: 'Mock time label',
  events: completedChildWorkflowEvents,
  firstEventId: completedChildWorkflowEvents[0].eventId,
};

export const mockSignalExternalWorkflowEventGroup: SignalExternalWorkflowExecutionHistoryGroup =
  {
    label: 'Mock signal external workflow',
    groupType: 'SignalExternalWorkflowExecution',
    status: 'COMPLETED',
    eventsMetadata: [],
    hasMissingEvents: false,
    timeMs: 1725769570375,
    startTimeMs: 1725769470356,
    timeLabel: 'Mock time label',
    events: signaledExternalWorkflowEvents,
    firstEventId: signaledExternalWorkflowEvents[0].eventId,
  };

export const mockRequestCancelExternalWorkflowEventGroup: RequestCancelExternalWorkflowExecutionHistoryGroup =
  {
    label: 'Mock request cancel external workflow',
    groupType: 'RequestCancelExternalWorkflowExecution',
    status: 'COMPLETED',
    eventsMetadata: [],
    hasMissingEvents: false,
    timeMs: 1725749570927,
    startTimeMs: 1725749470886,
    timeLabel: 'Mock time label',
    events: requestedCancelExternalWorkflowEvents,
    firstEventId: requestedCancelExternalWorkflowEvents[0].eventId,
  };

export const mockSingleEventGroup: SingleEventHistoryGroup = {
  label: 'Mock event',
  groupType: 'Event',
  status: 'COMPLETED',
  eventsMetadata: [],
  hasMissingEvents: false,
  timeMs: 1725747380000,
  startTimeMs: 1725747380000,
  timeLabel: 'Mock time label',
  events: [startWorkflowExecutionEvent],
  firstEventId: startWorkflowExecutionEvent.eventId,
};

export const mockWorkflowSignaledEventGroup: WorkflowSignaledHistoryGroup = {
  label: 'Mock workflow signaled',
  groupType: 'WorkflowSignaled',
  status: 'COMPLETED',
  eventsMetadata: [],
  hasMissingEvents: false,
  timeMs: 1724747415549,
  startTimeMs: 1724747415549,
  timeLabel: 'Mock time label',
  events: workflowSignaledEvents,
  firstEventId: workflowSignaledEvents[0].eventId,
};
