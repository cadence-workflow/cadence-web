export type CodeBlockProps = {
  content: string;
  language?: string;
};

// Custom code block component with syntax highlighting potential
export default function CodeBlock({ content, language }: CodeBlockProps) {
  return (
    <pre>
      <code className={language ? `language-${language}` : undefined}>
        {content}
      </code>
    </pre>
  );
}
