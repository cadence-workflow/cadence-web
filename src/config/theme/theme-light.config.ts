import { DeepPartial, MakeExtendable, Theme } from 'baseui/styles';
import baseWebIconsOverrides from './base-web-icons-overrides.config';

const themeLight = {
  grid: { maxWidth: 1580 },
  icons: baseWebIconsOverrides,
} satisfies DeepPartial<MakeExtendable<Theme>>;

export default themeLight;
