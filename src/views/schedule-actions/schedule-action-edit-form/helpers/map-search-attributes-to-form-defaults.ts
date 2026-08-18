import { type _uber_cadence_api_v1_ScheduleAction_StartWorkflowAction as StartWorkflowAction } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleAction';
import formatPayloadMap from '@/utils/data-formatters/format-payload-map';
import losslessJsonStringify from '@/utils/lossless-json-stringify';

import { type EditScheduleFormData } from '../schedule-action-edit-form.types';

export default function mapSearchAttributesToFormDefaults(
  searchAttributes: StartWorkflowAction['searchAttributes'] | undefined
): EditScheduleFormData['searchAttributes'] {
  const decoded = formatPayloadMap(searchAttributes ?? null, 'indexedFields')
    ?.indexedFields as Record<string, unknown> | undefined;

  if (!decoded || Object.keys(decoded).length === 0) {
    return undefined;
  }

  return Object.entries(decoded).map(([key, value]) => ({
    key,
    // The form only edits primitives; anything richer keeps its JSON text.
    value:
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
        ? value
        : losslessJsonStringify(value),
  }));
}
