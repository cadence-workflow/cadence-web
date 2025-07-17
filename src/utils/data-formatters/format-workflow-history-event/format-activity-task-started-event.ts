import formatFailureDetails from '../format-failure-details';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskStartedEvent } from './format-workflow-history-event.type';

const formatActivityTaskStartedEvent = ({
  activityTaskStartedEventAttributes: {
    lastFailure,
    scheduledEventId,
    requestId,
    identity,
    attempt,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskStartedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    lastFailureDetails: formatFailureDetails(lastFailure),
    lastFailureReason: lastFailure?.reason || null,
    attempt,
    identity,
    scheduledEventId: parseInt(scheduledEventId),
    requestId,
    ...eventAttributes,
  };
};

export default formatActivityTaskStartedEvent;
