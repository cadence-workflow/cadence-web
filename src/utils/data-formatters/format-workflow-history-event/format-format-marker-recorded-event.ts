import formatPayload from '../format-payload';
import formatPayloadMap from '../format-payload-map';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type MarkerRecordedEvent } from './format-workflow-history-event.type';

const formatMarkerRecordedEvent = ({
  markerRecordedEventAttributes: {
    decisionTaskCompletedEventId,
    details,
    header,
    ...eventAttributes
  },
  ...eventFields
}: MarkerRecordedEvent) => {
  return {
    ...formatWorkflowCommonEventFields(eventFields),
    ...eventAttributes,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    details: formatPayload(details),
    header: formatPayloadMap(header, 'fields'),
  };
};

export default formatMarkerRecordedEvent;
