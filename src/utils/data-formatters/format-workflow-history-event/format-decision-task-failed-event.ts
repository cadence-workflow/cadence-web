import formatEnum from '../format-enum';
import formatFailureDetails from '../format-failure-details';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type DecisionTaskFailedEvent } from './format-workflow-history-event.type';

const formatDecisionTaskFailedEvent = ({
  decisionTaskFailedEventAttributes: {
    failure,
    forkEventVersion,
    scheduledEventId,
    startedEventId,
    cause,
    ...eventAttributes
  },
  ...eventFields
}: DecisionTaskFailedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    details: formatFailureDetails(failure),
    forkEventVersion: parseInt(forkEventVersion),
    reason: failure?.reason || null,
    cause: formatEnum(cause, 'DECISION_TASK_FAILED_CAUSE'),
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatDecisionTaskFailedEvent;
