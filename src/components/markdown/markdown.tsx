'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import MarkdocRenderer from '@/components/markdoc/markdoc';

import { styled } from './markdown.styles';
import type { Props } from './markdown.types';

export default function Markdown({ markdown, useMarkdoc = false }: Props) {
  return (
    <styled.ViewContainer>
      {useMarkdoc ? (
        <MarkdocRenderer content={markdown} />
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      )}
    </styled.ViewContainer>
  );
}
