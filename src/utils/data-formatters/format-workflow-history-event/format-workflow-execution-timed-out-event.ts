import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionTimedOutEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionTimedOutEvent = ({
  workflowExecutionTimedOutEventAttributes: { ...eventAttributes },
  ...eventFields
}: WorkflowExecutionTimedOutEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
  };
};

export default formatWorkflowExecutionTimedOutEvent;
