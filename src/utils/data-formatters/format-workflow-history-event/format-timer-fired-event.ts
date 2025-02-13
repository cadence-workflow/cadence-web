import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type TimerFiredEvent } from './format-workflow-history-event.type';

const formatTimerFiredEvent = ({
  timerFiredEventAttributes: { startedEventId, ...eventAttributes },
  ...eventFields
}: TimerFiredEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    startedEventId: parseInt(startedEventId),
  };
};

export default formatTimerFiredEvent;
