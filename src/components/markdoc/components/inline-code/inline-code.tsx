export type InlineCodeProps = {
  content?: string;
  children?: any;
};

// Custom inline code component
export default function InlineCode({ content, children }: InlineCodeProps) {
  // Use content if provided, otherwise use children
  const codeContent = content || children;

  return <code>{codeContent}</code>;
}
