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
  },
} satisfies DeepPartial<MakeExtendable<Theme>>;

export default themeLight;
