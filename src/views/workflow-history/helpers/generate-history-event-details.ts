import isObjectLike from 'lodash/isObjectLike';

import {
  type EventDetailsEntries,
  type EventDetailsSingleEntry,
  type EventDetailsGroupEntry,
} from '../workflow-history-event-details/workflow-history-event-details.types';

import getHistoryEventFieldRenderConfig from './get-history-event-field-render-config';

export default function generateHistoryEventDetails({
  details,
  negativeFields,
  parentPath = '',
  eventType: eventTypeArg,
}: {
  details: object;
  negativeFields?: Array<string>;
  parentPath?: string;
  eventType?: string;
}): EventDetailsEntries {
  if (details === null || details === undefined) {
    return [];
  }

  const eventType = eventTypeArg ?? getEventTypeFromDetails(details);
  const eventTypeFields = eventType ? { eventType } : {};

  const result: EventDetailsEntries = [];

  Object.entries(details).forEach(([key, value]) => {
    const path = parentPath ? `${parentPath}.${key}` : key;

    const renderConfig = getHistoryEventFieldRenderConfig({
      key,
      path,
      value,
    });

    if (renderConfig?.hide && renderConfig.hide({ key, path, value })) {
      return;
    }

    if (!renderConfig?.valueComponent && isObjectLike(value)) {
      const entries = Object.entries(value);
      if (entries.length === 1) {
        result.push(
          ...generateHistoryEventDetails({
            details: value,
            parentPath: path,
            negativeFields,
            eventType,
          })
        );
      } else {
        const groupEntry: EventDetailsGroupEntry = {
          key,
          path,
          isGroup: true,
          groupEntries: generateHistoryEventDetails({
            details: value,
            parentPath: path,
            negativeFields,
            eventType,
          }),
          renderConfig,
          ...eventTypeFields,
        };
        result.push(groupEntry);
      }
      return;
    }

    const entry: EventDetailsSingleEntry = {
      key,
      path,
      value,
      renderConfig,
      isGroup: false,
      ...eventTypeFields,
      ...(negativeFields && negativeFields.includes(path)
        ? { isNegative: true }
        : {}),
    };
    result.push(entry);
  });

  return result;
}

function getEventTypeFromDetails(details: object): string | undefined {
  if (
    'eventType' in details &&
    typeof details.eventType === 'string' &&
    details.eventType.length > 0
  ) {
    return details.eventType;
  }
  return undefined;
}
