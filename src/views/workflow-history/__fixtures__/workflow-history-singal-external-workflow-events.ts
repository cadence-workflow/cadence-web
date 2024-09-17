import type { SignalExternalWorkflowExecutionHistoryEvent } from '../workflow-history.types';

export const initiateSignalExternalWorkflowEvent = {
  eventId: '30',
  eventTime: {
    seconds: '1725769470',
    nanos: 356394585,
  },
  version: '575102',
  taskId: '8090823668',
  signalExternalWorkflowExecutionInitiatedEventAttributes: {
    decisionTaskCompletedEventId: '4',
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.reset.base-b3439f7e-1daa-4716-a42e-3a621631bad3',
      runId: '',
    },
    signalName: 'signalBeforeReset',
    input: {
      data: 'InNpZ25hbFZhbHVlIgo=',
    },
    control: 'MA==',
    childWorkflowOnly: true,
  },
  attributes: 'signalExternalWorkflowExecutionInitiatedEventAttributes',
} as const satisfies SignalExternalWorkflowExecutionHistoryEvent;

export const signalExternalWorkflowEvent = {
  eventId: '31',
  eventTime: {
    seconds: '1725769570',
    nanos: 375790674,
  },
  version: '575102',
  taskId: '8090823672',
  externalWorkflowExecutionSignaledEventAttributes: {
    initiatedEventId: '30',
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.reset.base-b3439f7e-1daa-4716-a42e-3a621631bad3',
      runId: '',
    },
    control: 'MA==',
  },
  attributes: 'externalWorkflowExecutionSignaledEventAttributes',
} as const satisfies SignalExternalWorkflowExecutionHistoryEvent;

export const failSignalExternalWorkflowEvent = {
  eventId: '31',
  eventTime: {
    seconds: '1725769670',
    nanos: 375790674,
  },
  version: '575102',
  taskId: '8090823672',
  signalExternalWorkflowExecutionFailedEventAttributes: {
    cause: 'SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED_CAUSE_INVALID',
    decisionTaskCompletedEventId: '4',
    initiatedEventId: '30',
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.reset.base-b3439f7e-1daa-4716-a42e-3a621631bad3',
      runId: '',
    },
    control: 'MA==',
  },
  attributes: 'signalExternalWorkflowExecutionFailedEventAttributes',
} as const satisfies SignalExternalWorkflowExecutionHistoryEvent;

export const signaledExternalWorkflowEvents: SignalExternalWorkflowExecutionHistoryEvent[] =
  [initiateSignalExternalWorkflowEvent, signalExternalWorkflowEvent];

export const failedSignalExternalWorkflowEvents: SignalExternalWorkflowExecutionHistoryEvent[] =
  [initiateSignalExternalWorkflowEvent, failSignalExternalWorkflowEvent];
