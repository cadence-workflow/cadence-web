import formatPayload from '../format-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskCompletedEvent } from './format-workflow-history-event.type';

const formatActivityTaskCompletedEvent = ({
  activityTaskCompletedEventAttributes: {
    result,
    scheduledEventId,
    startedEventId,
    identity,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskCompletedEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    result: formatPayload(result),
    identity,
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatActivityTaskCompletedEvent;
