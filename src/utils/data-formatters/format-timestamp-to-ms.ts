import formatTimestampToDatetime from '@/utils/data-formatters/format-timestamp-to-datetime';

export default function formatTimestampToMs(
  timestamp:
    | { seconds: number | string; nanos: number | string }
    | null
    | undefined
): number | null {
  const timestampMs = formatTimestampToDatetime(timestamp)?.getTime();

  return timestampMs != null && Number.isFinite(timestampMs)
    ? timestampMs
    : null;
}
