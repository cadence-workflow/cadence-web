import { type StyleProps } from './style.types';

// Validates CSS color values to prevent injection of unexpected values.
// Accepts named colors, hex codes, and rgb/rgba/hsl/hsla functions.
function isValidCssColor(value: string): boolean {
  return /^(#[0-9a-fA-F]{3,8}|rgb\(.*\)|rgba\(.*\)|hsl\(.*\)|hsla\(.*\)|[a-zA-Z]+)$/.test(
    value.trim()
  );
}

export default function Style({ color, bg, children }: StyleProps) {
  const cssStyle: React.CSSProperties = {};

  if (color && isValidCssColor(color)) {
    cssStyle.color = color;
  }

  if (bg && isValidCssColor(bg)) {
    cssStyle.backgroundColor = bg;
  }

  return <span style={cssStyle}>{children}</span>;
}
