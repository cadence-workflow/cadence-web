import { type Duration } from '@/__generated__/proto-ts/google/protobuf/Duration';
import type { Timestamp } from '@/__generated__/proto-ts/google/protobuf/Timestamp';

export default function parseGrpcTimestamp(time: Timestamp | Duration): number {
  return parseInt(time.seconds) * 1000 + time.nanos / 1000000;
}
