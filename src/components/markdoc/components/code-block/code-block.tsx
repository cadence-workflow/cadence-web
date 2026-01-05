export type CodeBlockProps = {
  content?: string;
  language?: string;
  children?: any;
};

// Custom code block component with syntax highlighting potential
export default function CodeBlock({
  content,
  language,
  children,
}: CodeBlockProps) {
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
