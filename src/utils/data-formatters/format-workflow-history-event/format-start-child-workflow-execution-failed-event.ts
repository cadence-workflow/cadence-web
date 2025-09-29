import formatBase64Payload from '../format-base64-payload';

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
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    cause,
    ...eventAttributes,
    control: control ? parseInt(formatBase64Payload(control)) : null,
    initiatedEventId: parseInt(initiatedEventId),
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    ...secondaryCommonFields,
  };
};

export default formatStartChildWorkflowExecutionFailedEvent;
