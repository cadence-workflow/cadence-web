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
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatTimerCanceledEvent;
