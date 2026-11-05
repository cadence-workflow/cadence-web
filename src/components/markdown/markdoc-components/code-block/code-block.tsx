import { styled } from './code-block.styles';

export type CodeBlockProps = {
  content: string;
  language?: string;
};

// Custom code block component with syntax highlighting potential
export default function CodeBlock({ content, language }: CodeBlockProps) {
  return (
    <styled.Pre>
      <styled.Code className={language ? `language-${language}` : undefined}>
        {content}
      </styled.Code>
    </styled.Pre>
  );
}
