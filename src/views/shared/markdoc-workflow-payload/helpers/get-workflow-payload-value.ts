import get from 'lodash/get';

import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';

export default function getWorkflowPayloadValue(
  payload: PrettyJsonValue,
  path?: string
): PrettyJsonValue {
  return path ? get(payload, path) : payload;
}
