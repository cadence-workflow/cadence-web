import { type Duration } from '@/__generated__/proto-ts/google/protobuf/Duration';
import dayjs from '@/utils/datetime/dayjs';

export type FormatDurationUnitType = 'y' | 'M' | 'd' | 'h' | 'm' | 's' | 'ms';

const formatDuration = (
  duration: Duration | null,
  {
    separator = ', ',
    minUnit = 'ms',
  }: { separator?: string; minUnit?: FormatDurationUnitType } = {}
) => {
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
  const allUnits: Array<FormatDurationUnitType> = [
    'y',
    'M',
    'd',
    'h',
    'm',
    's',
    'ms',
  ];
  const units = allUnits.slice(0, allUnits.indexOf(minUnit) + 1);
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
    .join(separator);

  return result || defaultReturn;
};

export default formatDuration;
