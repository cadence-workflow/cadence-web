import get from 'lodash/get';

export default function getWorkflowPayloadValue(
  payload: unknown,
  path?: string
): unknown {
  return path ? get(payload, path) : payload;
}
