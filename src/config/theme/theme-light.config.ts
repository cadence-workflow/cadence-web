import {
  type DeepPartial,
  type MakeExtendable,
  type Theme,
} from 'baseui/styles';

import baseWebIconsOverrides from './base-web-icons-overrides.config';

const themeLight = {
  grid: { maxWidth: 1580 },
  icons: baseWebIconsOverrides,
  colors: {
    borderOpaque: '#F3F3F3',
    backgroundSecondary: '#F3F3F3',
    backgroundTertiary: '#E8E8E8',
    backgroundWarningLight: '#FDF2DC',
    backgroundPositive: '#0E8345',
  },
} satisfies DeepPartial<MakeExtendable<Theme>>;

export default themeLight;
