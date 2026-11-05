'use client';
import React, { useContext, useMemo } from 'react';

import { parse, renderers, transform } from '@markdoc/markdoc';

import addVariableNames from '../helpers/add-variable-names';
import getFieldVariables from '../helpers/get-field-variables';
import { MarkdownContext } from '../markdown-context-provider/markdown-context-provider';

import { type Props } from './markdown-content.types';

export default function MarkdownContent({
  content,
  config,
  components,
}: Props) {
  const { fieldValues, fieldMeta } = useContext(MarkdownContext);

  const ast = useMemo(
    () => addVariableNames(parse(content), config),
    [content, config]
  );
  const variables = useMemo(
    () => getFieldVariables(fieldValues, fieldMeta),
    [fieldValues, fieldMeta]
  );
  const renderableTree = useMemo(
    () => transform(ast, { ...config, variables }),
    [ast, config, variables]
  );

  return <>{renderers.react(renderableTree, React, { components })}</>;
}
