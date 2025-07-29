import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type TimerCanceledEvent } from './format-workflow-history-event.type';

const formatTimerCanceledEvent = ({
  timerCanceledEventAttributes: {
    decisionTaskCompletedEventId,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: TimerCanceledEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    startedEventId: parseInt(startedEventId),
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    ...secondaryCommonFields,
  };
};

export default formatTimerCanceledEvent;
