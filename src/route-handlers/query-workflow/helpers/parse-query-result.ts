import { type Payload } from '@/__generated__/proto-ts/uber/cadence/api/v1/Payload';

export default function parseQueryResult(queryResult: Payload) {
  return JSON.parse(Buffer.from(queryResult.data, 'base64').toString('utf-8'));
}
