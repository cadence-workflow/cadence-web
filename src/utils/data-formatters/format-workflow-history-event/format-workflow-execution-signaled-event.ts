import formatInputPayload from '../format-input-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionSignaledEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionSignaledEvent = ({
  workflowExecutionSignaledEventAttributes: { input, ...eventAttributes },
  ...eventFields
}: WorkflowExecutionSignaledEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    input: formatInputPayload(input),
  };
};

export default formatWorkflowExecutionSignaledEvent;
