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
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    input: formatInputPayload(input),
    ...eventAttributes,
    requestId,
  };
};

export default formatWorkflowExecutionSignaledEvent;
