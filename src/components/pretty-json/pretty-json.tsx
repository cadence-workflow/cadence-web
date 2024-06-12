'use client';
import { JsonView, allExpanded } from 'react-json-view-lite';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import { cssStyles } from './pretty-json.styles';
import type { Props } from './pretty-json.types';

export default function PrettyJson({ json }: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  return (
    <JsonView
      data={json as object}
      shouldExpandNode={allExpanded}
      clickToExpandNode
      style={{ ...cls, noQuotesForStringValues: false }}
    />
  );
}
