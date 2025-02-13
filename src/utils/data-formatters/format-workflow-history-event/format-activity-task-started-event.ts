import formatFailureDetails from '../format-failure-details';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskStartedEvent } from './format-workflow-history-event.type';

const formatActivityTaskStartedEvent = ({
  activityTaskStartedEventAttributes: {
    lastFailure,
    scheduledEventId,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskStartedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    lastFailureDetails: formatFailureDetails(lastFailure),
    lastFailureReason: lastFailure?.reason || '',
    scheduledEventId: parseInt(scheduledEventId),
  };
};

export default formatActivityTaskStartedEvent;
