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
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    identity,
    binaryChecksum,
    executionContext: executionContext || null,
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatDecisionTaskCompletedEvent;
