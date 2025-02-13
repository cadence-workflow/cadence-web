import formatPayload from '../format-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ChildWorkflowExecutionCompletedEvent } from './format-workflow-history-event.type';

const formatChildWorkflowExecutionCompletedEvent = ({
  childWorkflowExecutionCompletedEventAttributes: {
    initiatedEventId,
    result,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ChildWorkflowExecutionCompletedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    initiatedEventId: parseInt(initiatedEventId),
    result: formatPayload(result),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatChildWorkflowExecutionCompletedEvent;
