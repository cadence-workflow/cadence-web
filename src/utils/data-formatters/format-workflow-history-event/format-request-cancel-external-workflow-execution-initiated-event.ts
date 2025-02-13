import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type RequestCancelExternalWorkflowExecutionInitiatedEvent } from './format-workflow-history-event.type';

const formatRequestCancelExternalWorkflowExecutionInitiatedEvent = ({
  requestCancelExternalWorkflowExecutionInitiatedEventAttributes: {
    control,
    decisionTaskCompletedEventId,
    ...eventAttributes
  },
  ...eventFields
}: RequestCancelExternalWorkflowExecutionInitiatedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    control: control ? parseInt(atob(control)) : null,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
  };
};

export default formatRequestCancelExternalWorkflowExecutionInitiatedEvent;
