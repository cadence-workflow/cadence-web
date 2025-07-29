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
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    reason: reason || null,
    details: formatPayload(details),
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatWorkflowExecutionTerminatedEvent;
