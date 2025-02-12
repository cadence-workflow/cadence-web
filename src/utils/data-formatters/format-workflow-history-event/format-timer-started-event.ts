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
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    startToFireTimeoutSeconds: formatDurationToSeconds(startToFireTimeout),
  };
};

export default formatTimerStartedEvent;
