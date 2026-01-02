import { type ReactNode } from 'react';

import SignalButton from '@/components/signal-button/signal-button';
import StartWorkflowButton from '@/components/start-workflow-button/start-workflow-button';

// Custom heading component with proper anchor support
export function Heading({
  level,
  children,
  ...rest
}: {
  level: number;
  children?: ReactNode;
  [key: string]: any;
}) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag {...rest}>{children}</Tag>;
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
  children,
}: {
  content?: string;
  language?: string;
  children?: any;
}) {
  // Use content if provided, otherwise use children
  const codeContent = content || children;

  return (
    <pre>
      <code className={language ? `language-${language}` : undefined}>
        {codeContent}
      </code>
    </pre>
  );
}

// Custom inline code component
export function InlineCode({
  content,
  children,
}: {
  content?: string;
  children?: any;
}) {
  // Use content if provided, otherwise use children
  const codeContent = content || children;

  return <code>{codeContent}</code>;
}

// Export all components that Markdoc can use
export const markdocComponents = {
  SignalButton,
  StartWorkflowButton,
  Heading,
  List,
  CodeBlock,
  InlineCode,
};

export type MarkdocComponents = typeof markdocComponents;
