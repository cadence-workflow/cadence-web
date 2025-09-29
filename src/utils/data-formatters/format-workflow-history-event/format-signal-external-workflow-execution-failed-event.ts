import formatBase64Payload from '../format-base64-payload';

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
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    cause,
    control: control ? parseInt(formatBase64Payload(control)) : null,
    initiatedEventId: parseInt(initiatedEventId),
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    ...secondaryCommonFields,
  };
};

export default formatSignalExternalWorkflowExecutionFailedEvent;
