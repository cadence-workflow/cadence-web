import { type ReactNode } from 'react';

export type HeadingProps = {
  level: number;
  children?: ReactNode;
  [key: string]: any;
};

// Custom heading component with proper anchor support
export default function Heading({ level, children, ...rest }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag {...rest}>{children}</Tag>;
}
