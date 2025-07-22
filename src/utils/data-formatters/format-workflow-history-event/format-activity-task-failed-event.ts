import formatFailureDetails from '../format-failure-details';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskFailedEvent } from './format-workflow-history-event.type';

const formatActivityTaskFailedEvent = ({
  activityTaskFailedEventAttributes: {
    failure,
    scheduledEventId,
    startedEventId,
    identity,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskFailedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    details: formatFailureDetails(failure),
    reason: failure?.reason || null,
    identity,
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
    ...eventAttributes,
  };
};

export default formatActivityTaskFailedEvent;
