import React from 'react';
import { withStyle } from 'baseui';
import { StyledLink } from 'baseui/link';

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
  className,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <TableLinkBase
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
      disabled={!href}
    >
      {children}
    </TableLinkBase>
  );
}
