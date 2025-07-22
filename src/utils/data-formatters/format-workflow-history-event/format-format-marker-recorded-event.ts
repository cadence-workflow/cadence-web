import formatPayload from '../format-payload';
import formatPayloadMap from '../format-payload-map';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type MarkerRecordedEvent } from './format-workflow-history-event.type';

const formatMarkerRecordedEvent = ({
  markerRecordedEventAttributes: {
    decisionTaskCompletedEventId,
    details,
    header,
    markerName,
    ...eventAttributes
  },
  ...eventFields
}: MarkerRecordedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    markerName,
    details: formatPayload(details),
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    header: formatPayloadMap(header, 'fields'),
    ...eventAttributes,
  };
};

export default formatMarkerRecordedEvent;
