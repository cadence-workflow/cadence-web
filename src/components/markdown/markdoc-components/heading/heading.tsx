import { type ComponentPropsWithoutRef } from 'react';

import { HEADING_BY_LEVEL } from './heading.styles';

export type HeadingProps = ComponentPropsWithoutRef<'h1'> & {
  level: number;
};

// Custom heading component with proper anchor support
export default function Heading({ level, children, ...rest }: HeadingProps) {
  const clamped = Math.min(6, Math.max(1, Math.round(level) || 1));
  const Tag = HEADING_BY_LEVEL[clamped as keyof typeof HEADING_BY_LEVEL];
  return <Tag {...rest}>{children}</Tag>;
}
