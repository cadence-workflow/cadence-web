import formatBase64Payload from '../format-base64-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type RequestCancelExternalWorkflowExecutionInitiatedEvent } from './format-workflow-history-event.type';

const formatRequestCancelExternalWorkflowExecutionInitiatedEvent = ({
  requestCancelExternalWorkflowExecutionInitiatedEventAttributes: {
    control,
    decisionTaskCompletedEventId,
    ...eventAttributes
  },
  ...eventFields
}: RequestCancelExternalWorkflowExecutionInitiatedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    control: control ? parseInt(formatBase64Payload(control)) : null,
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    ...secondaryCommonFields,
  };
};

export default formatRequestCancelExternalWorkflowExecutionInitiatedEvent;
