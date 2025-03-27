import formatEnum from '../format-enum';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type DecisionTaskTimedOutEvent } from './format-workflow-history-event.type';

const formatDecisionTaskTimedOutEvent = ({
  decisionTaskTimedOutEventAttributes: {
    forkEventVersion,
    scheduledEventId,
    startedEventId,
    cause,
    ...eventAttributes
  },
  ...eventFields
}: DecisionTaskTimedOutEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    cause: formatEnum(cause, 'DECISION_TASK_TIMED_OUT_CAUSE'),
    forkEventVersion: parseInt(forkEventVersion),
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatDecisionTaskTimedOutEvent;
