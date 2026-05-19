import type { Timestamp__Input } from '@/__generated__/proto-ts/google/protobuf/Timestamp';

export default function getGrpcTimestampFromIso(
  isoDate: string
): Timestamp__Input {
  const ms = Date.parse(isoDate);
  const seconds = Math.floor(ms / 1000);
  const nanos = (ms - seconds * 1000) * 1_000_000;
  return { seconds, nanos };
}
