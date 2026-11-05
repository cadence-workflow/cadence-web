import { styled } from './inline-code.styles';

export type InlineCodeProps = {
  content: string;
};

// Custom inline code component
export default function InlineCode({ content }: InlineCodeProps) {
  return <styled.Code>{content}</styled.Code>;
}
