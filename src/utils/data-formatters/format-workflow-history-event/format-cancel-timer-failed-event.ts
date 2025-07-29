import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type CancelTimerFailedEvent } from './format-workflow-history-event.type';

const formatCancelTimerFailedEvent = ({
  cancelTimerFailedEventAttributes: {
    decisionTaskCompletedEventId,
    ...eventAttributes
  },
  ...eventFields
}: CancelTimerFailedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    ...secondaryCommonFields,
  };
};

export default formatCancelTimerFailedEvent;
