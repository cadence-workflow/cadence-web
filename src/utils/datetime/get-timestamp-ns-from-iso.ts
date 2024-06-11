export default function getTimestampNsFromISO(isoDate: string): string {
  const date = new Date(isoDate);
  return date.getTime() + '000000';
}
