const workflowErrorAttributes = [
  'workflowExecutionFailedEventAttributes',
  'workflowExecutionTimedOutEventAttributes',
];

const getWorkflowIsError = (lastEventAttributes: string) =>
  workflowErrorAttributes.includes(lastEventAttributes);

export default getWorkflowIsError;
