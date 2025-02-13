import { type Duration } from '@/__generated__/proto-ts/google/protobuf/Duration';

const formatDurationToSeconds = (
  duration?: Pick<Duration, 'seconds'> | null
) => (duration ? parseInt(String(duration.seconds)) : null);

export default formatDurationToSeconds;
