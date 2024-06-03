'use client';
import useStyletronClasses from '@/hooks/use-styletron-classes';
import { JsonView, allExpanded } from 'react-json-view-lite';
import type { Props } from './pretty-json.types';
import { cssStyles } from './pretty-json.styles';

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
