import React from 'react';

import NextLink from 'next/link';

import { styled } from './link.styles';
import { type Props } from './link.types';

export default function Link({ href, children, ...restProps }: Props) {
  return (
    <styled.LinkBase {...restProps} $as={NextLink} href={href} disabled={!href}>
      {children}
    </styled.LinkBase>
  );
}
