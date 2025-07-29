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
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    details: formatPayload(details),
    ...eventAttributes,
    initiatedEventId: parseInt(initiatedEventId),
    startedEventId: parseInt(startedEventId),
    ...secondaryCommonFields,
  };
};

export default formatChildWorkflowExecutionCanceledEvent;
