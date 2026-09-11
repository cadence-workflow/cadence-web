export default function formatInteger(
  value: number,
  locale: Intl.LocalesArgument = 'en-US'
): string {
  if (typeof Intl === 'undefined' || !Intl.NumberFormat) {
    return String(value);
  }

  return new Intl.NumberFormat(locale).format(value);
}
