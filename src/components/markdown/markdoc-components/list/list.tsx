import { type ReactNode } from 'react';

import { styled } from './list.styles';

export type ListProps = {
  ordered?: boolean;
  children: ReactNode;
};

// Custom list component
export default function List({ ordered, children }: ListProps) {
  const Tag = ordered ? styled.OrderedList : styled.UnorderedList;
  return <Tag>{children}</Tag>;
}
