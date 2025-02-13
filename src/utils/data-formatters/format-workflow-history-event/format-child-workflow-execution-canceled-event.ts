import formatPayload from '../format-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ChildWorkflowExecutionCanceledEvent } from './format-workflow-history-event.type';

const formatChildWorkflowExecutionCanceledEvent = ({
  childWorkflowExecutionCanceledEventAttributes: {
    details,
    initiatedEventId,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ChildWorkflowExecutionCanceledEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    details: formatPayload(details),
    initiatedEventId: parseInt(initiatedEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatChildWorkflowExecutionCanceledEvent;
