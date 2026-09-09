const MAXIMUM_FRACTION_DIGITS = 2;
const MINIMUM_DISPLAYED_PERCENT = 10 ** -MAXIMUM_FRACTION_DIGITS / 100;

export default function formatBatchActionProgressPercent(
  completed: number,
  total: number,
  locale?: Intl.LocalesArgument
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: MAXIMUM_FRACTION_DIGITS,
  });
  if (total <= 0) {
    return formatter.format(0);
  }

  const progress = Math.min(Math.max(completed / total, 0), 1);
  const formattedProgress = formatter.format(progress);

  if (completed > 0 && formattedProgress === formatter.format(0)) {
    return `<${formatter.format(MINIMUM_DISPLAYED_PERCENT)}`;
  }

  return formattedProgress;
}
