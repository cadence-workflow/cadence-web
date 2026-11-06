import { type StyleProps } from './style.types';

// Validates CSS color values to prevent injection of unexpected values.
// Accepts named colors, hex (3/4/6/8), and rgb/rgba/hsl/hsla with numeric args only.
function isValidCssColor(value: string): boolean {
  const v = value.trim();
  return /^(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{4}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8}|rgba?\([0-9,.\s%]+\)|hsla?\([0-9,.\s%]+\)|[a-zA-Z]+)$/.test(
    v
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
