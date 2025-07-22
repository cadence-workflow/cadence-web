import formatPayload from '../format-payload';
import formatWorkflowEventId from '../format-workflow-event-id';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type WorkflowExecutionCompletedEvent } from './format-workflow-history-event.type';

const formatWorkflowExecutionCompletedEvent = ({
  workflowExecutionCompletedEventAttributes: {
    decisionTaskCompletedEventId,
    result,
    ...eventAttributes
  },
  ...eventFields
}: WorkflowExecutionCompletedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    result: formatPayload(result),
    decisionTaskCompletedEventId: formatWorkflowEventId(
      decisionTaskCompletedEventId
    ),
    ...eventAttributes,
  };
};

export default formatWorkflowExecutionCompletedEvent;
