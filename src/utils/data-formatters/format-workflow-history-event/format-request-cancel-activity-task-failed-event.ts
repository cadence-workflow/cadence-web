import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type RequestCancelActivityTaskFailedEvent } from './format-workflow-history-event.type';

const formatRequestCancelActivityTaskFailedEvent = ({
  requestCancelActivityTaskFailedEventAttributes: {
    decisionTaskCompletedEventId,
    ...eventAttributes
  },
  ...eventFields
}: RequestCancelActivityTaskFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
  };
};

export default formatRequestCancelActivityTaskFailedEvent;
