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
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    initiatedEventId: parseInt(initiatedEventId),
    startedEventId: parseInt(startedEventId),
    ...secondaryCommonFields,
  };
};

export default formatChildWorkflowExecutionTerminatedEvent;
