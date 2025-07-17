import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type DecisionTaskCompletedEvent } from './format-workflow-history-event.type';

const formatDecisionTaskCompletedEvent = ({
  decisionTaskCompletedEventAttributes: {
    executionContext,
    identity,
    binaryChecksum,
    ...eventAttributes
  },
  ...eventFields
}: DecisionTaskCompletedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    identity,
    binaryChecksum,
    executionContext: executionContext || null,
    ...eventAttributes,
  };
};

export default formatDecisionTaskCompletedEvent;
