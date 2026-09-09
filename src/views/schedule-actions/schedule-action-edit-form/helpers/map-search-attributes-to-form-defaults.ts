import { type _uber_cadence_api_v1_ScheduleAction_StartWorkflowAction as StartWorkflowAction } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleAction';
import formatPayloadMap from '@/utils/data-formatters/format-payload-map';

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
    // ponytail: cast only; zod rejects non-primitives on submit instead of dropping them
    value: value as string | number | boolean,
  }));
}
