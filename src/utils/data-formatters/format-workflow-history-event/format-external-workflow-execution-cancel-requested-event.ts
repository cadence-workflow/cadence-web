import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ExternalWorkflowExecutionCancelRequestedEvent } from './format-workflow-history-event.type';

const formatExternalWorkflowExecutionCancelRequestedEvent = ({
  externalWorkflowExecutionCancelRequestedEventAttributes: {
    initiatedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ExternalWorkflowExecutionCancelRequestedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    initiatedEventId: parseInt(initiatedEventId),
    ...eventAttributes,
  };
};

export default formatExternalWorkflowExecutionCancelRequestedEvent;
