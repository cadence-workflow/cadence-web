import {
  type FormattedWorkflowExecutionCanceledEvent,
  type FormattedWorkflowExecutionCompletedEvent,
  type FormattedWorkflowExecutionFailedEvent,
  type FormattedWorkflowExecutionTerminatedEvent,
  type FormattedWorkflowExecutionTimedOutEvent,
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

  it('should return details for WorkflowExecutionFailed event', () => {
    const formattedEvent: FormattedWorkflowExecutionFailedEvent = {
      eventType: 'WorkflowExecutionFailed',
      reason: 'cadenceInternal:Generic',
      details: 'failed details',
      eventId: 2,
      timestamp: null,
      decisionTaskCompletedEventId: '1',
    };
    expect(getWorkflowResultJson(formattedEvent)).toBe('failed details');
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
    expect(getWorkflowResultJson(formattedEvent)).toBe('terminated details');
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

  it('should return undefined for other eventType', () => {
    const formattedEvent: FormattedWorkflowExecutionTimedOutEvent = {
      eventType: 'WorkflowExecutionTimedOut',
      eventId: 1,
      timeoutType: 'TIMEOUT_TYPE_HEARTBEAT',
      timestamp: null,
    };
    expect(getWorkflowResultJson(formattedEvent)).toBeUndefined();
  });

  it('should return undefined if eventType is undefined', () => {
    const formattedEvent = {};
    // @ts-expect-error empty eventType
    expect(getWorkflowResultJson(formattedEvent)).toBeUndefined();
  });
});
