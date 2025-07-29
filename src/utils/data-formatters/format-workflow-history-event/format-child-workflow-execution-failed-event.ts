import formatFailureDetails from '../format-failure-details';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ChildWorkflowExecutionFailedEvent } from './format-workflow-history-event.type';

const formatChildWorkflowExecutionFailedEvent = ({
  childWorkflowExecutionFailedEventAttributes: {
    failure,
    initiatedEventId,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ChildWorkflowExecutionFailedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    details: formatFailureDetails(failure),
    reason: failure?.reason || null,
    ...eventAttributes,
    initiatedEventId: parseInt(initiatedEventId),
    startedEventId: parseInt(startedEventId),
    ...secondaryCommonFields,
  };
};

export default formatChildWorkflowExecutionFailedEvent;
