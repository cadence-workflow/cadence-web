'use client';
import Markdown from 'react-markdown';

import { styled } from './md.styles';
import type { Props } from './md.types';

export default function Md({ markdown }: Props) {
  return (
    <styled.ViewContainer>
      <Markdown
        components={{
          p: ({ children }) => <p>{children}</p>,
        }}
      >
        {markdown}
      </Markdown>
    </styled.ViewContainer>
  );
}
