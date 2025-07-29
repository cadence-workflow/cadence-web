import formatPayload from '../format-payload';
import formatWorkflowEventId from '../format-workflow-event-id';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionCanceledEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionCanceledEvent = ({
  workflowExecutionCanceledEventAttributes: {
    decisionTaskCompletedEventId,
    details,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionCanceledEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    details: formatPayload(details),
    decisionTaskCompletedEventId: formatWorkflowEventId(
      decisionTaskCompletedEventId
    ),
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatWorkflowExecutionCanceledEvent;
