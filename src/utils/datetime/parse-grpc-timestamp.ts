import type { Timestamp } from '@/__generated__/proto-ts/google/protobuf/Timestamp';

export default function parseGrpcTimestamp(time: Timestamp): number {
  return time.seconds * 1000 + time.nanos / 1000000;
}
