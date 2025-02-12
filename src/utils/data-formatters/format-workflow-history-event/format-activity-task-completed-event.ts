import formatPayload from '../format-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskCompletedEvent } from './format-workflow-history-event.type';

const formatActivityTaskCompletedEvent = ({
  activityTaskCompletedEventAttributes: {
    result,
    scheduledEventId,
    startedEventId,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskCompletedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    result: formatPayload(result),
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatActivityTaskCompletedEvent;
