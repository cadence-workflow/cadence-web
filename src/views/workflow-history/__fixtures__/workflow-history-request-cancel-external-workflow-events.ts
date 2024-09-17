import type { RequestCancelExternalWorkflowExecutionHistoryEvent } from '../workflow-history.types';

export const initiateRequestCancelExternalWorkflowEvent = {
  eventId: '25',
  eventTime: {
    seconds: '1725749470',
    nanos: 886551263,
  },
  version: '575102',
  taskId: '5877269814',
  requestCancelExternalWorkflowExecutionInitiatedEventAttributes: {
    decisionTaskCompletedEventId: '24',
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.cancellation-workflow.cancellation.external-child',
      runId: '',
    },
    control: '',
    childWorkflowOnly: true,
  },
  attributes: 'requestCancelExternalWorkflowExecutionInitiatedEventAttributes',
} as const satisfies RequestCancelExternalWorkflowExecutionHistoryEvent;

export const requestCancelExternalWorkflowEvent = {
  eventId: '26',
  eventTime: {
    seconds: '1725749570',
    nanos: 927769344,
  },
  version: '575102',
  taskId: '5877269818',
  externalWorkflowExecutionCancelRequestedEventAttributes: {
    initiatedEventId: '25',
    domain: 'cadence-domain',
    workflowExecution: {
      workflowId: 'workflow.cancellation-workflow.cancellation.external-child',
      runId: '',
    },
  },
  attributes: 'externalWorkflowExecutionCancelRequestedEventAttributes',
} as const satisfies RequestCancelExternalWorkflowExecutionHistoryEvent;

export const requestedCancelExternalWorkflowEvents: RequestCancelExternalWorkflowExecutionHistoryEvent[] =
  [
    initiateRequestCancelExternalWorkflowEvent,
    requestCancelExternalWorkflowEvent,
  ];
