import formatInputPayload from '../format-input-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type SignalExternalWorkflowExecutionInitiatedEvent } from './format-workflow-history-event.type';

const formatSignalExternalWorkflowExecutionInitiatedEvent = ({
  signalExternalWorkflowExecutionInitiatedEventAttributes: {
    control,
    decisionTaskCompletedEventId,
    input,
    signalName,
    ...eventAttributes
  },
  ...eventFields
}: SignalExternalWorkflowExecutionInitiatedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    input: formatInputPayload(input),
    signalName,
    control: control ? parseInt(atob(control)) : null,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    ...secondaryCommonFields,
  };
};

export default formatSignalExternalWorkflowExecutionInitiatedEvent;
