import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type CancelTimerFailedEvent } from './format-workflow-history-event.type';

const formatCancelTimerFailedEvent = ({
  cancelTimerFailedEventAttributes: {
    decisionTaskCompletedEventId,
    ...eventAttributes
  },
  ...eventFields
}: CancelTimerFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
  };
};

export default formatCancelTimerFailedEvent;
