import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ExternalWorkflowExecutionSignaledEvent } from './format-workflow-history-event.type';

const formatExternalWorkflowExecutionSignaledEvent = ({
  externalWorkflowExecutionSignaledEventAttributes: {
    control,
    initiatedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ExternalWorkflowExecutionSignaledEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    control: control ? parseInt(atob(control)) : null,
    initiatedEventId: parseInt(initiatedEventId),
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatExternalWorkflowExecutionSignaledEvent;
