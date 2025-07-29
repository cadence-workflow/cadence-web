import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskCancelRequestedEvent } from './format-workflow-history-event.type';

const formatActivityTaskCancelRequestedEvent = ({
  activityTaskCancelRequestedEventAttributes: {
    decisionTaskCompletedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskCancelRequestedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    ...secondaryCommonFields,
  };
};

export default formatActivityTaskCancelRequestedEvent;
