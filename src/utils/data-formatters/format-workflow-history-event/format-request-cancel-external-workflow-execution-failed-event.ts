import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type RequestCancelExternalWorkflowExecutionFailedEvent } from './format-workflow-history-event.type';

const formatRequestCancelExternalWorkflowExecutionFailedEvent = ({
  requestCancelExternalWorkflowExecutionFailedEventAttributes: {
    control,
    decisionTaskCompletedEventId,
    initiatedEventId,
    ...eventAttributes
  },
  ...eventFields
}: RequestCancelExternalWorkflowExecutionFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    control: control ? parseInt(atob(control)) : null,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    initiatedEventId: parseInt(initiatedEventId),
  };
};

export default formatRequestCancelExternalWorkflowExecutionFailedEvent;
