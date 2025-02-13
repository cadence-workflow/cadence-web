import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type SignalExternalWorkflowExecutionFailedEvent } from './format-workflow-history-event.type';

const formatSignalExternalWorkflowExecutionFailedEvent = ({
  signalExternalWorkflowExecutionFailedEventAttributes: {
    control,
    decisionTaskCompletedEventId,
    initiatedEventId,
    ...eventAttributes
  },
  ...eventFields
}: SignalExternalWorkflowExecutionFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    control: control ? parseInt(atob(control)) : null,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    initiatedEventId: parseInt(initiatedEventId),
  };
};

export default formatSignalExternalWorkflowExecutionFailedEvent;
