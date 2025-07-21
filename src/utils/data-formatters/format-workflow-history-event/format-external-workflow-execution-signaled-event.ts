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
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    control: control ? parseInt(atob(control)) : null,
    initiatedEventId: parseInt(initiatedEventId),
    ...eventAttributes,
  };
};

export default formatExternalWorkflowExecutionSignaledEvent;
