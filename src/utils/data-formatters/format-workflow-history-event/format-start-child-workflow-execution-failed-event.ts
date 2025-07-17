import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type StartChildWorkflowExecutionFailedEvent } from './format-workflow-history-event.type';

const formatStartChildWorkflowExecutionFailedEvent = ({
  startChildWorkflowExecutionFailedEventAttributes: {
    control,
    decisionTaskCompletedEventId,
    initiatedEventId,
    cause,
    ...eventAttributes
  },
  ...eventFields
}: StartChildWorkflowExecutionFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    cause,
    ...eventAttributes,
    control: control ? parseInt(atob(control)) : null,
    initiatedEventId: parseInt(initiatedEventId),
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
  };
};

export default formatStartChildWorkflowExecutionFailedEvent;
