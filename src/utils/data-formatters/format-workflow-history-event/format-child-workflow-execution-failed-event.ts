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
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    details: formatFailureDetails(failure),
    initiatedEventId: parseInt(initiatedEventId),
    reason: failure?.reason || '',
    startedEventId: parseInt(startedEventId),
  };
};

export default formatChildWorkflowExecutionFailedEvent;
