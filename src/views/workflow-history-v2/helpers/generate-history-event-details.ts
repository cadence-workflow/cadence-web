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
}: {
  details: object;
  negativeFields?: Array<string>;
  parentPath?: string;
}): EventDetailsEntries {
  if (details === null || details === undefined) {
    return [];
  }

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
          }),
          renderConfig,
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
      ...(negativeFields && negativeFields.includes(path)
        ? { isNegative: true }
        : {}),
    };
    result.push(entry);
  });

  return result;
}
