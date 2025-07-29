import formatInputPayload from '../format-input-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionSignaledEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionSignaledEvent = ({
  workflowExecutionSignaledEventAttributes: {
    input,
    requestId,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionSignaledEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    input: formatInputPayload(input),
    ...eventAttributes,
    requestId,
    ...secondaryCommonFields,
  };
};

export default formatWorkflowExecutionSignaledEvent;
