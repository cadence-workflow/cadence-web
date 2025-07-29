import formatFailureDetails from '../format-failure-details';
import formatWorkflowEventId from '../format-workflow-event-id';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionFailedEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionFailedEvent = ({
  workflowExecutionFailedEventAttributes: {
    decisionTaskCompletedEventId,
    failure,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionFailedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    reason: failure?.reason || null,
    details: formatFailureDetails(failure),
    decisionTaskCompletedEventId: formatWorkflowEventId(
      decisionTaskCompletedEventId
    ),
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatWorkflowExecutionFailedEvent;
