'use client';

import MarkdocRenderer from '@/components/markdoc/markdoc';

import { styled } from './markdown.styles';
import type { Props } from './markdown.types';

export default function Markdown({ markdown }: Props) {
  return (
    <styled.ViewContainer>
      <MarkdocRenderer content={markdown} />
    </styled.ViewContainer>
  );
}
