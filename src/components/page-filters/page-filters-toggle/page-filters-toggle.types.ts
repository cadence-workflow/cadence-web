import { type ButtonProps } from 'baseui/button';

export type Props = {
  onClick: ButtonProps['onClick'];
  activeFiltersCount: number;
  isActive: boolean;
};
