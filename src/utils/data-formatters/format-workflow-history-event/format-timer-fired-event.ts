import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type TimerFiredEvent } from './format-workflow-history-event.type';

const formatTimerFiredEvent = ({
  timerFiredEventAttributes: { startedEventId, ...eventAttributes },
  ...eventFields
}: TimerFiredEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    startedEventId: parseInt(startedEventId),
    ...secondaryCommonFields,
  };
};

export default formatTimerFiredEvent;
