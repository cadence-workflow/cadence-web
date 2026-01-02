'use client';
import React from 'react';

import { parse, renderers, transform } from '@markdoc/markdoc';

import { styled } from '@/components/markdown/markdown.styles';

import { markdocComponents } from './components';
import { markdocConfig } from './schema';

export type MarkdocRendererProps = {
  content: string;
};

export default function MarkdocRenderer({ content }: MarkdocRendererProps) {
  let normalizedContent = content || '';

  // Remove base indentation from the first non-empty line
  const lines = normalizedContent.split('\n');

  // Find the indentation of the first non-empty line
  const firstNonEmptyLine = lines.find((line) => line.trim().length > 0);

  if (firstNonEmptyLine) {
    const baseIndentMatch = firstNonEmptyLine.match(/^[\t ]*/);
    const baseIndent = baseIndentMatch ? baseIndentMatch[0] : '';
    const baseIndentLength = baseIndent.length;

    if (baseIndentLength > 0) {
      // Remove the base indentation from all lines
      normalizedContent = lines
        .map((line) => {
          if (line.trim().length === 0) return ''; // Empty lines become truly empty
          // Remove base indent if the line starts with it
          if (line.startsWith(baseIndent)) {
            return line.slice(baseIndentLength);
          }
          // If line has different/less indentation, leave it as is
          return line;
        })
        .join('\n')
        .trim();
    } else {
      normalizedContent = normalizedContent.trim();
    }
  } else {
    normalizedContent = normalizedContent.trim();
  }

  // Parse the markdown content
  const ast = parse(normalizedContent);

  // Transform the AST with our schema
  const renderableTree = transform(ast, markdocConfig);

  // Render to React with our custom components
  return (
    <styled.ViewContainer>
      {renderers.react(renderableTree, React, {
        components: markdocComponents,
      })}
    </styled.ViewContainer>
  );
}
