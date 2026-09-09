export default function formatBatchActionProgressPercent(
  completed: number,
  total: number,
  locale?: Intl.LocalesArgument
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 2,
  });
  if (total <= 0) {
    return formatter.format(0);
  }

  const progress = Math.min(Math.max(completed / total, 0), 1);
  const formattedProgress = formatter.format(progress);

  if (completed > 0 && formattedProgress === formatter.format(0)) {
    return `<${formatter.format(0.0001)}`;
  }

  return formattedProgress;
}
