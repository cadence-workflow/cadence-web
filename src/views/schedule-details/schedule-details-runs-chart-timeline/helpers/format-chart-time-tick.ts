import dayjs from '@/utils/datetime/dayjs';

export default function formatChartTimeTick(timestampMs: number) {
  return {
    date: dayjs(timestampMs).format('MMM D,'),
    time: dayjs(timestampMs).format('HH:mm'),
  };
}
