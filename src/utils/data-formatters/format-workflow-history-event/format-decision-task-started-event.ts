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
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    identity,
    scheduledEventId: parseInt(scheduledEventId),
    requestId,
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatDecisionTaskStartedEvent;
