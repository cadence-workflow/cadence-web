import type { Timestamp__Input } from '@/__generated__/proto-ts/google/protobuf/Timestamp';

export default function getGrpcTimestampFromIso(
  isoDate: string
): Timestamp__Input {
  const date = new Date(isoDate);
  return {
    seconds: date.getTime() / 1000,
    nanos: date.getUTCMilliseconds() * 1000000,
  };
}
