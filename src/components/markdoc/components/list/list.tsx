import { type ReactNode } from 'react';

export type ListProps = {
  ordered?: boolean;
  children: ReactNode;
};

// Custom list component
export default function List({ ordered, children }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag>{children}</Tag>;
}
