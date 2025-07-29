import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionTimedOutEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionTimedOutEvent = ({
  workflowExecutionTimedOutEventAttributes: { ...eventAttributes },
  ...eventFields
}: WorkflowExecutionTimedOutEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatWorkflowExecutionTimedOutEvent;
