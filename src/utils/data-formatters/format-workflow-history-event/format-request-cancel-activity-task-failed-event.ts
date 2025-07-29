import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type RequestCancelActivityTaskFailedEvent } from './format-workflow-history-event.type';

const formatRequestCancelActivityTaskFailedEvent = ({
  requestCancelActivityTaskFailedEventAttributes: {
    decisionTaskCompletedEventId,
    ...eventAttributes
  },
  ...eventFields
}: RequestCancelActivityTaskFailedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    ...secondaryCommonFields,
  };
};

export default formatRequestCancelActivityTaskFailedEvent;
