import type React from 'react';

import { type StyledLink } from 'baseui/link';
import type NextLink from 'next/link';

type LinkProps = React.ComponentProps<typeof NextLink> &
  React.ComponentProps<typeof StyledLink>;

export type Props = Omit<LinkProps, 'color'> & {
  color?: LinkProps['color'] | 'contentPrimary' | 'contentInversePrimary';
};
