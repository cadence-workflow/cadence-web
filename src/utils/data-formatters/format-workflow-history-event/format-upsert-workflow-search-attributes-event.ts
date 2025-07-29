import formatPayloadMap from '../format-payload-map';

import formatWorkflowCommonEventFields from './format-workflow-common-event-fields';
import { type UpsertWorkflowSearchAttributesEvent } from './format-workflow-history-event.type';

const formatUpsertWorkflowSearchAttributesEvent = ({
  upsertWorkflowSearchAttributesEventAttributes: {
    decisionTaskCompletedEventId,
    searchAttributes,
    ...eventAttributes
  },
  ...eventFields
}: UpsertWorkflowSearchAttributesEvent) => {
  const { primaryCommonFields, secondaryCommonFields } =
    formatWorkflowCommonEventFields(eventFields);

  return {
    ...primaryCommonFields,
    decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
    searchAttributes: formatPayloadMap(searchAttributes, 'indexedFields'),
    ...eventAttributes,
    ...secondaryCommonFields,
  };
};

export default formatUpsertWorkflowSearchAttributesEvent;
