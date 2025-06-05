'use client';
import Markdown from 'react-markdown'
import type { Props } from './md.types.tsx';
import { styled } from './md.styles';

export default function Md({ markdown }: Props) {
  return <styled.ViewContainer>
    <Markdown components={{
      p: ({ children }) => <p>{children}</p>
    }}>{markdown}</Markdown>
  </styled.ViewContainer>;
}
