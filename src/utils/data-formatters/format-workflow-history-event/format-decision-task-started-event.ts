import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type DecisionTaskStartedEvent } from './format-workflow-history-event.type';

const formatDecisionTaskStartedEvent = ({
  decisionTaskStartedEventAttributes: {
    scheduledEventId,
    requestId,
    identity,
    ...eventAttributes
  },
  ...eventFields
}: DecisionTaskStartedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    identity,
    scheduledEventId: parseInt(scheduledEventId),
    requestId,
    ...eventAttributes,
  };
};

export default formatDecisionTaskStartedEvent;
