import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ChildWorkflowExecutionTerminatedEvent } from './format-workflow-history-event.type';

const formatChildWorkflowExecutionTerminatedEvent = ({
  childWorkflowExecutionTerminatedEventAttributes: {
    initiatedEventId,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ChildWorkflowExecutionTerminatedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    initiatedEventId: parseInt(initiatedEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatChildWorkflowExecutionTerminatedEvent;
