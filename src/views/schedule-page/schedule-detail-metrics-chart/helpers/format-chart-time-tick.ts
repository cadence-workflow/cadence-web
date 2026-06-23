import dayjs from '@/utils/datetime/dayjs';

export default function formatChartTimeTick(timestampMs: number) {
  return dayjs(timestampMs).format('HH:mm');
}
