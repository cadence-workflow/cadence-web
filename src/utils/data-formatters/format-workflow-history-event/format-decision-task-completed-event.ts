import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type DecisionTaskCompletedEvent } from './format-workflow-history-event.type';

const formatDecisionTaskCompletedEvent = ({
  decisionTaskCompletedEventAttributes: { ...eventAttributes },
  ...eventFields
}: DecisionTaskCompletedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
  };
};

export default formatDecisionTaskCompletedEvent;
