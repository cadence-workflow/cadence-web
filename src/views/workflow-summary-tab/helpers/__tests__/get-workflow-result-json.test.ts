import {
  type FormattedWorkflowExecutionCanceledEvent,
  type FormattedWorkflowExecutionCompletedEvent,
  type FormattedWorkflowExecutionFailedEvent,
  type FormattedWorkflowExecutionTerminatedEvent,
  type FormattedWorkflowExecutionTimedOutEvent,
  type FormattedWorkflowExecutionContinuedAsNewEvent,
  type FormattedTimerFiredEvent,
} from '@/utils/data-formatters/schema/format-history-event-schema';

import getWorkflowResultJson from '../get-workflow-result-json';

describe('getWorkflowResultJson', () => {
  it('should return details for WorkflowExecutionCanceled event', () => {
    const formattedEvent: FormattedWorkflowExecutionCanceledEvent = {
      eventType: 'WorkflowExecutionCanceled',
      details: 'canceled details',
      decisionTaskCompletedEventId: '1',
      eventId: 2,
      timestamp: null,
    };
    expect(getWorkflowResultJson(formattedEvent)).toBe('canceled details');
  });

  it('should return details and reason for WorkflowExecutionFailed event', () => {
    const formattedEvent: FormattedWorkflowExecutionFailedEvent = {
      eventType: 'WorkflowExecutionFailed',
      reason: 'cadenceInternal:Generic',
      details: 'failed details',
      eventId: 2,
      timestamp: null,
      decisionTaskCompletedEventId: '1',
    };
    expect(getWorkflowResultJson(formattedEvent)).toEqual({
      reason: 'cadenceInternal:Generic',
      details: 'failed details',
    });
  });

  it('should return details for WorkflowExecutionTerminated event', () => {
    const formattedEvent: FormattedWorkflowExecutionTerminatedEvent = {
      eventType: 'WorkflowExecutionTerminated',
      details: 'terminated details',
      reason: 'cadenceInternal:Generic',
      eventId: 2,
      timestamp: null,
      identity: '1111',
    };
    expect(getWorkflowResultJson(formattedEvent)).toEqual({
      reason: 'cadenceInternal:Generic',
      details: 'terminated details',
    });
  });

  it('should return result for WorkflowExecutionCompleted event', () => {
    const formattedEvent: FormattedWorkflowExecutionCompletedEvent = {
      eventType: 'WorkflowExecutionCompleted',
      result: 'completed result',
      decisionTaskCompletedEventId: '1',
      eventId: 1,
      timestamp: null,
    };
    expect(getWorkflowResultJson(formattedEvent)).toBe('completed result');
  });

  it('should return timeoutType for WorkflowExecutionTimedOut event', () => {
    const formattedEvent: FormattedWorkflowExecutionTimedOutEvent = {
      eventType: 'WorkflowExecutionTimedOut',
      eventId: 1,
      timeoutType: 'TIMEOUT_TYPE_HEARTBEAT',
      timestamp: null,
    };
    expect(getWorkflowResultJson(formattedEvent)).toEqual({
      timeoutType: 'TIMEOUT_TYPE_HEARTBEAT',
    });
  });

  it('should return correct fields for WorkflowExecutionContinuedAsNew event', () => {
    const formattedEvent: FormattedWorkflowExecutionContinuedAsNewEvent = {
      backoffStartIntervalInSeconds: 0,
      decisionTaskCompletedEventId: '',
      eventId: 1,
      eventType: 'WorkflowExecutionContinuedAsNew',
      executionStartToCloseTimeoutSeconds: 0,
      workflowType: null,
      timestamp: null,
      header: { fields: {} },
      input: [],
      memo: { fields: {} },
      searchAttributes: { indexedFields: '' },
      taskList: { kind: 'NORMAL', name: '' },
      taskStartToCloseTimeoutSeconds: 0,
      newExecutionRunId: '',
      initiator: 'CRON_SCHEDULE',
      failureDetails: 'Failure Details',
      failureReason: 'Failure Reason',
      lastCompletionResult: null,
    };
    expect(getWorkflowResultJson(formattedEvent)).toEqual({
      initiator: 'CRON_SCHEDULE',
      failureDetails: 'Failure Details',
      failureReason: 'Failure Reason',
      lastCompletionResult: null,
    });
  });

  it('should return undefined for other eventType', () => {
    const formattedEvent: FormattedTimerFiredEvent = {
      eventType: 'TimerFired',
      eventId: 3,
      timestamp: null,
      startedEventId: 2,
      timerId: '1',
    };
    expect(getWorkflowResultJson(formattedEvent)).toBeUndefined();
  });

  it('should return undefined if eventType is undefined', () => {
    const formattedEvent = {};
    // @ts-expect-error empty eventType
    expect(getWorkflowResultJson(formattedEvent)).toBeUndefined();
  });
});
