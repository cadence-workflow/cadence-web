import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ChildWorkflowExecutionTimedOutEvent } from './format-workflow-history-event.type';

const formatChildWorkflowExecutionTimedOutEvent = ({
  childWorkflowExecutionTimedOutEventAttributes: {
    initiatedEventId,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ChildWorkflowExecutionTimedOutEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    initiatedEventId: parseInt(initiatedEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatChildWorkflowExecutionTimedOutEvent;
