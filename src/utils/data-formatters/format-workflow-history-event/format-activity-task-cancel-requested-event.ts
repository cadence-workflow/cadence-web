import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskCancelRequestedEvent } from './format-workflow-history-event.type';

const formatActivityTaskCancelRequestedEvent = ({
  activityTaskCancelRequestedEventAttributes: {
    decisionTaskCompletedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskCancelRequestedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
  };
};

export default formatActivityTaskCancelRequestedEvent;
