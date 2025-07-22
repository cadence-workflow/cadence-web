import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type RequestCancelExternalWorkflowExecutionFailedEvent } from './format-workflow-history-event.type';

const formatRequestCancelExternalWorkflowExecutionFailedEvent = ({
  requestCancelExternalWorkflowExecutionFailedEventAttributes: {
    control,
    cause,
    decisionTaskCompletedEventId,
    initiatedEventId,
    ...eventAttributes
  },
  ...eventFields
}: RequestCancelExternalWorkflowExecutionFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    cause,
    control: control ? parseInt(atob(control)) : null,
    initiatedEventId: parseInt(initiatedEventId),
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
  };
};

export default formatRequestCancelExternalWorkflowExecutionFailedEvent;
