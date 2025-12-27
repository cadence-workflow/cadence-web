'use client';

import { styled as markdownStyled } from '@/components/markdown/markdown.styles';

import { styled } from './mdx-viewer-page.styles';
import type { MDXViewerPageProps } from './mdx-viewer-page.types';

export default function MDXViewerPage({ children }: MDXViewerPageProps) {
  return (
    <styled.Container>
      <styled.BackLink href="/">
        <h2>Cadence</h2>
      </styled.BackLink>
      <markdownStyled.ViewContainer>
        <styled.Article>{children}</styled.Article>
      </markdownStyled.ViewContainer>
    </styled.Container>
  );
}
