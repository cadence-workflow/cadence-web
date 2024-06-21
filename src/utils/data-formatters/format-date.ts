import { format, isThisYear } from 'date-fns';

export default function formatDate(timestampMs: number) {
  const date = new Date(timestampMs);
  return format(
    date,
    isThisYear(date) ? 'dd MMM, HH:mm:ss z' : 'dd MMM yyyy, HH:mm:ss z'
  );
}
