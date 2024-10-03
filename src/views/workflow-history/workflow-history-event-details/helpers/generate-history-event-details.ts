import isObjectLike from 'lodash/isObjectLike';

import { type WorkflowHistoryEventDetailsEntry } from '../workflow-history-event-details.types';

import getHistoryEventFieldRenderConfig from './get-history-event-field-render-config';

function flatten<E extends object>(
  prefix: string,
  objValue: any,
  event: E,
  result: WorkflowHistoryEventDetailsEntry[]
) {
  Object.entries(objValue).forEach(([k, value]) => {
    const path = prefix ? `${prefix}.${k}` : k;

    const renderConfig = getHistoryEventFieldRenderConfig({
      key: k,
      path,
      value,
    });
    if (renderConfig?.hide && renderConfig.hide({ key: k, path, value })) {
      return;
    }

    if (!renderConfig?.valueComponent && isObjectLike(value)) {
      flatten(path, value, event, result);
      return;
    }

    result.push({ key: k, path, value, renderConfig });
  });
}

export default function generateHistoryEventDetails<E extends object>(
  event: E
) {
  const result: WorkflowHistoryEventDetailsEntry[] = [];
  flatten<E>('', event || {}, event, result);
  return result;
}
