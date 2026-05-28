import { type Duration__Input } from '@/__generated__/proto-ts/google/protobuf/Duration';

export default function getGrpcDurationFromSeconds(
  seconds: number
): Duration__Input {
  const secondsInt = Math.floor(seconds);
  const nanos = Math.round((seconds - secondsInt) * 1_000_000_000);

  if (nanos >= 1_000_000_000) {
    return { seconds: secondsInt + 1, nanos: 0 };
  }

  return { seconds: secondsInt, nanos };
}
