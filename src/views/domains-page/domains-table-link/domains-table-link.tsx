import React from 'react';

import { withStyle } from 'baseui';
import { StyledLink } from 'baseui/link';
import Link from 'next/link';

import { type Props } from './domains-table-link.types';

const TableLinkBase = withStyle<typeof StyledLink, { disabled: boolean }>(
  StyledLink,
  ({ $theme }) => ({
    '[disabled]': {
      pointerEvents: 'none',
      color: `${$theme.colors.contentStateDisabled} !important`,
    },
    ':visited': {
      color: 'inherit',
    },
  })
);

export default function DomainsTableLink({
  href,
  children,
  ...restProps
}: Props) {
  return (
    <TableLinkBase {...restProps} $as={Link} href={href} disabled={!href}>
      {children}
    </TableLinkBase>
  );
}
