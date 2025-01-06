import dayjs from '@/utils/datetime/dayjs';

export default function formatDate(timestampMs: number) {
  const date = dayjs(timestampMs);
  const now = dayjs();
  return date.format(
    date.isSame(now, 'year') ? 'DD MMM, HH:mm:ss z' : 'DD MMM YYYY, HH:mm:ss z'
  );
}
