const workflowCompletedAttributes = [
  'workflowExecutionCancelRequestedEventAttributes',
  'workflowExecutionCanceledEventAttributes',
  'workflowExecutionCompletedEventAttributes',
  'workflowExecutionContinuedAsNewEventAttributes',
  'workflowExecutionFailedEventAttributes',
  'workflowExecutionTerminatedEventAttributes',
  'workflowExecutionTimedOutEventAttributes',
];

const getWorkflowIsCompleted = (lastEventAttributes: string) =>
  workflowCompletedAttributes.includes(lastEventAttributes);

export default getWorkflowIsCompleted;
