import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type DecisionTaskTimedOutEvent } from './format-workflow-history-event.type';

const formatDecisionTaskTimedOutEvent = ({
  decisionTaskTimedOutEventAttributes: {
    forkEventVersion,
    scheduledEventId,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: DecisionTaskTimedOutEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    forkEventVersion: parseInt(forkEventVersion),
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatDecisionTaskTimedOutEvent;
