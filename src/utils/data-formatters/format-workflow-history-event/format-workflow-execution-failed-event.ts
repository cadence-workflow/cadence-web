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
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    decisionTaskCompletedEventId: formatWorkflowEventId(
      decisionTaskCompletedEventId
    ),
    details: formatFailureDetails(failure),
    reason: failure?.reason || '',
  };
};

export default formatWorkflowExecutionFailedEvent;
