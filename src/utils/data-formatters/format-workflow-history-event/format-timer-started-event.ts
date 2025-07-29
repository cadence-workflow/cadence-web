import formatDurationToSeconds from '../format-duration-to-seconds';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type TimerStartedEvent } from './format-workflow-history-event.type';

const formatTimerStartedEvent = ({
  timerStartedEventAttributes: {
    decisionTaskCompletedEventId,
    startToFireTimeout,
    ...eventAttributes
  },
  ...eventFields
}: TimerStartedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    startToFireTimeoutSeconds: formatDurationToSeconds(startToFireTimeout),
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    ...secondaryCommonFields,
  };
};

export default formatTimerStartedEvent;
