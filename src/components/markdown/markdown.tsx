'use client';
import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

import MDXSignal from '@/components/mdx-signal/mdx-signal';
import MDXStart from '@/components/mdx-start/mdx-start';

import { styled } from './markdown.styles';
import type { Props } from './markdown.types';

export default function Markdown({ markdown }: Props) {
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function compileMDX() {
      try {
        setError(null);

        // Compile markdown/MDX content
        const { default: Content } = await evaluate(markdown, {
          ...runtime,
          remarkPlugins: [remarkGfm],
          development: false,
          useMDXComponents: () => ({
            Start: MDXStart,
            Signal: MDXSignal,
          }),
        });

        setMDXContent(() => Content);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to compile markdown'));
      }
    }

    compileMDX();
  }, [markdown]);

  if (error) {
    return (
      <styled.ViewContainer>
        <p style={{ color: 'red' }}>Error rendering markdown: {error.message}</p>
      </styled.ViewContainer>
    );
  }

  if (!MDXContent) {
    return (
      <styled.ViewContainer>
        <p>Loading...</p>
      </styled.ViewContainer>
    );
  }

  return (
    <styled.ViewContainer>
      <MDXContent />
    </styled.ViewContainer>
  );
}
