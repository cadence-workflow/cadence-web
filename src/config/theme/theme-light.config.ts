import { DeepPartial, MakeExtendable, Theme } from "baseui/styles";
import baseWebIconsOverrides from "./base-web-icons-ovverrides.config";

const themeLight = {
  grid: { maxWidth: 1580 },
  icons: baseWebIconsOverrides,
} satisfies DeepPartial<MakeExtendable<Theme>>;

export default themeLight;
