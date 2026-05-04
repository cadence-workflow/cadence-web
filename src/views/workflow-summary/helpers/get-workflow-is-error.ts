const workflowErrorAttributes = [
  'workflowExecutionCanceledEventAttributes',
  'workflowExecutionFailedEventAttributes',
  'workflowExecutionTerminatedEventAttributes',
  'workflowExecutionTimedOutEventAttributes',
];

const getWorkflowIsError = (lastEventAttributes: string) =>
  workflowErrorAttributes.includes(lastEventAttributes);

export default getWorkflowIsError;
