import { type ReactNode } from 'react';

import SignalButton from '@/components/signal-button/signal-button';

// Custom heading component with proper anchor support
export function Heading({
  level,
  children,
}: {
  level: number;
  children: ReactNode;
}) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag>{children}</Tag>;
}

// Custom list component
export function List({
  ordered,
  children,
}: {
  ordered?: boolean;
  children: ReactNode;
}) {
  const Tag = ordered ? 'ol' : 'ul';
  return <Tag>{children}</Tag>;
}

// Custom code block component with syntax highlighting potential
export function CodeBlock({
  content,
  language,
}: {
  content: string;
  language?: string;
}) {
  return (
    <pre>
      <code className={language ? `language-${language}` : undefined}>
        {content}
      </code>
    </pre>
  );
}

// Export all components that Markdoc can use
export const markdocComponents = {
  SignalButton,
  Heading,
  List,
  CodeBlock,
};

export type MarkdocComponents = typeof markdocComponents;
