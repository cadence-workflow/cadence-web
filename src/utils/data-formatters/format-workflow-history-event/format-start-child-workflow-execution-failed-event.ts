import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type StartChildWorkflowExecutionFailedEvent } from './format-workflow-history-event.type';

const formatStartChildWorkflowExecutionFailedEvent = ({
  startChildWorkflowExecutionFailedEventAttributes: {
    control,
    decisionTaskCompletedEventId,
    initiatedEventId,
    ...eventAttributes
  },
  ...eventFields
}: StartChildWorkflowExecutionFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    control: control ? parseInt(atob(control)) : null,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    initiatedEventId: parseInt(initiatedEventId),
  };
};

export default formatStartChildWorkflowExecutionFailedEvent;
