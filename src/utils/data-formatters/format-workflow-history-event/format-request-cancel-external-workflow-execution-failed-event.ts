import formatBase64Payload from '../format-base64-payload';

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
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    cause,
    control: control ? parseInt(formatBase64Payload(control)) : null,
    initiatedEventId: parseInt(initiatedEventId),
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    ...secondaryCommonFields,
  };
};

export default formatRequestCancelExternalWorkflowExecutionFailedEvent;
