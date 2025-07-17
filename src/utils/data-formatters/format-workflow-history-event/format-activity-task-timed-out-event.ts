import formatEnum from '../format-enum';
import formatFailureDetails from '../format-failure-details';
import formatPayload from '../format-payload';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskTimedOutEvent } from './format-workflow-history-event.type';

const formatActivityTaskTimedOutEvent = ({
  activityTaskTimedOutEventAttributes: {
    details,
    lastFailure,
    scheduledEventId,
    startedEventId,
    timeoutType,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskTimedOutEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    timeoutType: formatEnum(timeoutType, 'TIMEOUT_TYPE', 'pascal'),
    details: formatPayload(details),
    lastFailureDetails: formatFailureDetails(lastFailure),
    lastFailureReason: lastFailure?.reason || null,
    scheduledEventId: parseInt(scheduledEventId),
    startedEventId: parseInt(startedEventId),
  };
};

export default formatActivityTaskTimedOutEvent;
