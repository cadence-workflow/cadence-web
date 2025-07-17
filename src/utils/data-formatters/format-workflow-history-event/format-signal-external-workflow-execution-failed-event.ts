import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type SignalExternalWorkflowExecutionFailedEvent } from './format-workflow-history-event.type';

const formatSignalExternalWorkflowExecutionFailedEvent = ({
  signalExternalWorkflowExecutionFailedEventAttributes: {
    control,
    cause,
    decisionTaskCompletedEventId,
    initiatedEventId,
    ...eventAttributes
  },
  ...eventFields
}: SignalExternalWorkflowExecutionFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    cause,
    control: control ? parseInt(atob(control)) : null,
    initiatedEventId: parseInt(initiatedEventId),
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
  };
};

export default formatSignalExternalWorkflowExecutionFailedEvent;
