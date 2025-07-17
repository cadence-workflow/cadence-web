import formatPayload from '../format-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionTerminatedEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionTerminatedEvent = ({
  workflowExecutionTerminatedEventAttributes: {
    reason,
    details,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionTerminatedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    reason: reason || null,
    details: formatPayload(details),
    ...eventAttributes,
  };
};

export default formatWorkflowExecutionTerminatedEvent;
