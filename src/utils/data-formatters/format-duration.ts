import { type Duration } from '@/__generated__/proto-ts/google/protobuf/Duration';
import dayjs from '@/utils/datetime/dayjs';

const formatDuration = (duration: Duration | null) => {
  const defaultReturn = '0s';
  if (!duration) {
    return defaultReturn;
  }
  const secondsAsMillis = duration.seconds
    ? parseInt(duration.seconds) * 1000
    : 0;
  const nanosAsMillis = duration.nanos ? duration.nanos / 1000000 : 0;
  const intMillis = Math.floor(nanosAsMillis);
  const remainingNanosAsMillis = nanosAsMillis % 1;
  const milliseconds = secondsAsMillis + intMillis;
  const units = ['y', 'M', 'd', 'h', 'm', 's', 'ms'] as const;
  const values: Partial<Record<(typeof units)[number], number>> = {};
  let d = dayjs.duration(milliseconds);
  units.forEach((unit) => {
    const value = d.as(unit);
    const intValue = Math.floor(value);
    if (unit === 'ms') {
      values[unit] = intValue + remainingNanosAsMillis;
    } else {
      values[unit] = intValue;
    }
    d = d.subtract(intValue, unit);
  });

  const result = units
    .filter((unit) => values[unit])
    .map((unit) => `${values[unit]}${unit}`)
    .join(', ');

  return result || defaultReturn;
};

export default formatDuration;
