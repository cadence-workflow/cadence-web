export default function getDateDaysBeforeToday(n: number) {
  const today = new Date();
  if (n === 0) return today;
  return new Date(today.setDate(today.getDate() - n));
}
