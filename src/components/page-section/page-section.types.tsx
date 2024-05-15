import React from 'react';

export type Props<
  T extends React.ComponentType<any> | keyof JSX.IntrinsicElements,
> = {
  children: React.ReactNode;
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>;
