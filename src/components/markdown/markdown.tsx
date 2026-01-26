'use client';
import React, { useMemo } from 'react';

import { parse, renderers, transform } from '@markdoc/markdoc';

import { markdocComponents } from './markdoc-components';
import { markdocConfig } from './markdoc-schema';
import { styled } from './markdown.styles';
import { type Props } from './markdown.types';

export default function Markdown({ markdown }: Props) {
  let normalizedContent = markdown || '';

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

  // Parse and transform the markdown content (memoized to prevent unnecessary recalculations)
  const renderableTree = useMemo(() => {
    const ast = parse(normalizedContent);
    return transform(ast, markdocConfig);
  }, [normalizedContent]);

  // Render to React with our custom components
  return (
    <styled.ViewContainer>
      {renderers.react(renderableTree, React, {
        components: markdocComponents,
      })}
    </styled.ViewContainer>
  );
}
