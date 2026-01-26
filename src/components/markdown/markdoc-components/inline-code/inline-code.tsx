export type InlineCodeProps = {
  content: string;
};

// Custom inline code component
export default function InlineCode({ content }: InlineCodeProps) {
  return <code>{content}</code>;
}
