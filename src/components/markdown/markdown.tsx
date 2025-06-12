'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { styled } from './markdown.styles';
import type { Props } from './markdown.types';

export default function Markdown({ markdown }: Props) {
  return (
    <styled.ViewContainer>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </styled.ViewContainer>
  );
}
