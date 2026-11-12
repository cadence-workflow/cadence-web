import { STYLE_COLOR_NAMES } from './style.constants';
import { type StyleColorName } from './style.types';

export default function isStyleColorName(
  value: unknown
): value is StyleColorName {
  return typeof value === 'string' && STYLE_COLOR_NAMES.has(value);
}
