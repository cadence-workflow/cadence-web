import formatFailureDetails from '../format-failure-details';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type DecisionTaskFailedEvent } from './format-workflow-history-event.type';

const formatDecisionTaskFailedEvent = ({
  decisionTaskFailedEventAttributes: {
    failure,
    forkEventVersion,
    scheduledEventId,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: DecisionTaskFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    details: formatFailureDetails(failure),
    forkEventVersion: parseInt(forkEventVersion),
    reason: failure?.reason || '',
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatDecisionTaskFailedEvent;
