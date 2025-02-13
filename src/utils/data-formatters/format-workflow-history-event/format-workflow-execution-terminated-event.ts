import formatPayload from '../format-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionTerminatedEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionTerminatedEvent = ({
  workflowExecutionTerminatedEventAttributes: { details, ...eventAttributes },
  ...eventFields
}: WorkflowExecutionTerminatedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    details: formatPayload(details),
  };
};

export default formatWorkflowExecutionTerminatedEvent;
