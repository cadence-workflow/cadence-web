import formatInputPayload from '../format-input-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type SignalExternalWorkflowExecutionInitiatedEvent } from './format-workflow-history-event.type';

const formatSignalExternalWorkflowExecutionInitiatedEvent = ({
  signalExternalWorkflowExecutionInitiatedEventAttributes: {
    control,
    decisionTaskCompletedEventId,
    input,
    ...eventAttributes
  },
  ...eventFields
}: SignalExternalWorkflowExecutionInitiatedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    control: control ? parseInt(atob(control)) : null,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    input: formatInputPayload(input),
  };
};

export default formatSignalExternalWorkflowExecutionInitiatedEvent;
