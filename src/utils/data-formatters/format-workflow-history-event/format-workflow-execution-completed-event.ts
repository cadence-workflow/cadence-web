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
    ...eventAttributes,
    decisionTaskCompletedEventId: formatWorkflowEventId(
      decisionTaskCompletedEventId
    ),
    result: formatPayload(result),
  };
};

export default formatWorkflowExecutionCompletedEvent;
