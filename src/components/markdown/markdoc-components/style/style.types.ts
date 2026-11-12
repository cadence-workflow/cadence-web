import { type ReactNode } from 'react';

import { type Theme } from 'baseui';

export type StyleColorName = Extract<keyof Theme['colors'], string>;

export type StyleProps = {
  color?: string;
  bg?: string;
  children?: ReactNode;
};
