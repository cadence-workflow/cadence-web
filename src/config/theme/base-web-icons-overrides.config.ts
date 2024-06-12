import { type ComponentType } from 'react';

import { type IconProps } from 'baseui/icon';
import { type Icon } from 'baseui/styles';
import { MdFilterList, MdSearch } from 'react-icons/md';

const baseWebIconsOverrides = {
  // IconProps needed by Baseweb is a super type of IconBaseProps from react-icons, so no issues should happen from casting
  Search: MdSearch as ComponentType<IconProps>,
  Filter: MdFilterList as ComponentType<IconProps>,
} satisfies Icon;

export default baseWebIconsOverrides;
