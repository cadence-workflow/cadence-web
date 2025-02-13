import formatFailureDetails from '../format-failure-details';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskFailedEvent } from './format-workflow-history-event.type';

const formatActivityTaskFailedEvent = ({
  activityTaskFailedEventAttributes: {
    failure,
    scheduledEventId,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    details: formatFailureDetails(failure),
    reason: failure?.reason || '',
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatActivityTaskFailedEvent;
