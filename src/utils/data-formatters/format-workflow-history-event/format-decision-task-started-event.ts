import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type DecisionTaskStartedEvent } from './format-workflow-history-event.type';

const formatDecisionTaskStartedEvent = ({
  decisionTaskStartedEventAttributes: { scheduledEventId, ...eventAttributes },
  ...eventFields
}: DecisionTaskStartedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    scheduledEventId: parseInt(scheduledEventId),
  };
};

export default formatDecisionTaskStartedEvent;
