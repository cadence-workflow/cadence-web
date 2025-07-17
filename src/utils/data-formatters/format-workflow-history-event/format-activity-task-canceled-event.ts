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
    details: formatPayload(details),
    latestCancelRequestedEventId: parseInt(latestCancelRequestedEventId),
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
    ...eventAttributes,
  };
};

export default formatActivityTaskCanceledEvent;
