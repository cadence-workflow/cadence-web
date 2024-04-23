import { IconProps } from "baseui/icon";
import { Icon } from "baseui/styles";
import { ComponentType } from "react";
import { MdSearch } from "react-icons/md";

const baseWebIconsOverrides = {
  // IconProps needed by basweb is super type of IconBaseProps from react-icons so no issues should happen from casting
  Search: MdSearch as ComponentType<IconProps>
} satisfies Icon;

export default baseWebIconsOverrides;