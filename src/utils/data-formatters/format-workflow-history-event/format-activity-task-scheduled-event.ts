import formatDurationToSeconds from '../format-duration-to-seconds';
import formatEnum from '../format-enum';
import formatInputPayload from '../format-input-payload';
import formatPayloadMap from '../format-payload-map';
import formatRetryPolicy from '../format-retry-policy';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type ActivityTaskScheduledEvent } from './format-workflow-history-event.type';

const formatActivityTaskScheduledEvent = ({
  activityTaskScheduledEventAttributes: {
    decisionTaskCompletedEventId,
    domain,
    header,
    heartbeatTimeout,
    input,
    retryPolicy,
    scheduleToCloseTimeout,
    scheduleToStartTimeout,
    startToCloseTimeout,
    taskList,
    ...eventAttributes
  },
  ...eventFields
}: ActivityTaskScheduledEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    domain: domain || null,
    header: formatPayloadMap(header, 'fields'),
    heartbeatTimeoutSeconds: formatDurationToSeconds(heartbeatTimeout),
    input: formatInputPayload(input),
    retryPolicy: formatRetryPolicy(retryPolicy),
    scheduleToCloseTimeoutSeconds: formatDurationToSeconds(
      scheduleToCloseTimeout
    ),
    scheduleToStartTimeoutSeconds: formatDurationToSeconds(
      scheduleToStartTimeout
    ),
    startToCloseTimeoutSeconds: formatDurationToSeconds(startToCloseTimeout),
    taskList: {
      kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
      name: taskList?.name || null,
    },
  };
};

export default formatActivityTaskScheduledEvent;
