export default function parseDateQueryParam(
  dateString: string
): Date | undefined {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
}
