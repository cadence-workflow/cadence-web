const HUES_WITH_SHADES_UP_TO_900 = [
  'gray',
  'platinum',
  'blue',
  'teal',
  'red',
  'green',
  'orange',
  'amber',
  'magenta',
  'purple',
  'yellow',
  'lime',
] as const;

const HUES_WITH_SHADES_UP_TO_700 = ['brown', 'cobalt'] as const;

const SHADES_UP_TO_900 = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
] as const;

const SHADES_UP_TO_700 = SHADES_UP_TO_900.slice(0, 8);

// Baseweb foundation colors that can be used with the style tag
export const STYLE_COLOR_NAMES: ReadonlySet<string> = new Set([
  'white',
  'black',
  ...HUES_WITH_SHADES_UP_TO_900.flatMap((hue) =>
    SHADES_UP_TO_900.map((shade) => `${hue}${shade}`)
  ),
  ...HUES_WITH_SHADES_UP_TO_700.flatMap((hue) =>
    SHADES_UP_TO_700.map((shade) => `${hue}${shade}`)
  ),
]);
