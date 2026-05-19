import { type Duration__Input } from '@/__generated__/proto-ts/google/protobuf/Duration';

export default function secondsToGrpcDurationInput(
  seconds: number
): Duration__Input {
  return { seconds, nanos: 0 };
}
