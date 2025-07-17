import formatEnum from '../format-enum';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type DecisionTaskTimedOutEvent } from './format-workflow-history-event.type';

const formatDecisionTaskTimedOutEvent = ({
  decisionTaskTimedOutEventAttributes: {
    forkEventVersion,
    scheduledEventId,
    startedEventId,
    cause,
    reason,
    ...eventAttributes
  },
  ...eventFields
}: DecisionTaskTimedOutEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    cause: formatEnum(cause, 'DECISION_TASK_TIMED_OUT_CAUSE'),
    reason,
    forkEventVersion: parseInt(forkEventVersion),
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
    ...eventAttributes,
  };
};

export default formatDecisionTaskTimedOutEvent;
