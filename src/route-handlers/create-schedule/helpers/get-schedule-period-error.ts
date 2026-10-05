export default function getSchedulePeriodError(
  startTime?: string,
  endTime?: string
): { message: string } | null {
  if (!startTime || !endTime) return null;

  if (Date.parse(startTime) >= Date.parse(endTime)) {
    return { message: 'Start date must be before end date' };
  }

  return null;
}
