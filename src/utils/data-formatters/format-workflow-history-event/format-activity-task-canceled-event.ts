import formatPayload from '../format-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskCanceledEvent } from './format-workflow-history-event.type';

const formatActivityTaskCanceledEvent = ({
  activityTaskCanceledEventAttributes: {
    details,
    latestCancelRequestedEventId,
    scheduledEventId,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskCanceledEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    details: formatPayload(details),
    latestCancelRequestedEventId: parseInt(latestCancelRequestedEventId),
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatActivityTaskCanceledEvent;
