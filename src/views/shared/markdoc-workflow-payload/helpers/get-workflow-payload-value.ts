import get from 'lodash/get';

import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';

export default function getWorkflowPayloadValue(
  payload: PrettyJsonValue,
  path?: string
): PrettyJsonValue {
  if (!path) return payload;
  if (payload === null || typeof payload !== 'object') return undefined;
  return get(payload, path) as PrettyJsonValue;
}
