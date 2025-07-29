import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ExternalWorkflowExecutionCancelRequestedEvent } from './format-workflow-history-event.type';

const formatExternalWorkflowExecutionCancelRequestedEvent = ({
  externalWorkflowExecutionCancelRequestedEventAttributes: {
    initiatedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ExternalWorkflowExecutionCancelRequestedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    initiatedEventId: parseInt(initiatedEventId),
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatExternalWorkflowExecutionCancelRequestedEvent;
