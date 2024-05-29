'use client';
import React from 'react';
import { Cell, Grid } from 'baseui/layout-grid';
import type { Props } from './page-section.types';

export default function PageSection<
  T extends React.ComponentType<any> | keyof JSX.IntrinsicElements = 'section',
>({ children, as, ...rest }: Props<T>) {
  const Component = as || 'section';
  return (
    <Component {...rest}>
      <Grid>
        <Cell span={12}>{children}</Cell>
      </Grid>
    </Component>
  );
}
