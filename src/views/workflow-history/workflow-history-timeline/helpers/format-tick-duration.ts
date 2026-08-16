import dayjs from '@/utils/datetime/dayjs';

export default function formatTickDuration(relativeTimeMs: number): string {
  const duration = dayjs.duration(relativeTimeMs);
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes()) % 60;
  const seconds = Math.floor(duration.asSeconds()) % 60;
  const milliseconds = Math.floor(duration.asMilliseconds()) % 1000;

  if (hours > 0) {
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }

  if (minutes > 0) {
    return `${minutes}m${seconds > 0 ? ` ${seconds}s` : ''}`;
  }

  if (seconds > 0) {
    return `${seconds}s${milliseconds > 0 ? ` ${milliseconds}ms` : ''}`;
  }

  return `${milliseconds}ms`;
}
