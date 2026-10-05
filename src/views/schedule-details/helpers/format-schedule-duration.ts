import formatDuration from '@/utils/data-formatters/format-duration';

export function formatScheduleDuration(
  duration: { seconds: number | string; nanos: number } | null | undefined
) {
  if (!duration) {
    return null;
  }

  return formatDuration({
    seconds: String(duration.seconds),
    nanos: duration.nanos,
  });
}
