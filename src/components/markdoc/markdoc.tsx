'use client';
import React from 'react';

import { parse, renderers, transform } from '@markdoc/markdoc';

import { markdocComponents } from './components';
import { markdocConfig } from './schema';

export type MarkdocRendererProps = {
  content: string;
};

export default function MarkdocRenderer({ content }: MarkdocRendererProps) {
  // Parse the markdown content
  const ast = parse(content);

  // Transform the AST with our schema
  const renderableTree = transform(ast, markdocConfig);

  // Render to React with our custom components
  return (
    <>
      {renderers.react(renderableTree, React, {
        components: markdocComponents,
      })}
    </>
  );
}
