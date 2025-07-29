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
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    ...eventAttributes,
    initiatedEventId: parseInt(initiatedEventId),
    startedEventId: parseInt(startedEventId),
    ...secondaryCommonFields,
  };
};

export default formatChildWorkflowExecutionTimedOutEvent;
