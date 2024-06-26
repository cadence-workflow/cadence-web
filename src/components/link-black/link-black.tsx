import React from 'react';

import Link from 'next/link';

import { styled } from './link-black.styles';
import { type Props } from './link-black.types';

export default function LinkBlack({ href, children, ...restProps }: Props) {
  return (
    <styled.LinkBase {...restProps} $as={Link} href={href} disabled={!href}>
      {children}
    </styled.LinkBase>
  );
}
