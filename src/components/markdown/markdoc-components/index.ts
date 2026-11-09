import { styled } from '../markdown.styles';

import Br from './br/br';
import CodeBlock from './code-block/code-block';
import Heading from './heading/heading';
import Image from './image/image';
import InlineCode from './inline-code/inline-code';
import InputField from './input-field/input-field';
import List from './list/list';
import SignalButton from './signal-button/signal-button';
import StartWorkflowButton from './start-workflow-button/start-workflow-button';

// Export all components that Markdoc can use
export const markdocComponents = {
  SignalButton,
  StartWorkflowButton,
  InputField,
  Heading,
  List,
  CodeBlock,
  InlineCode,
  Image,
  Br,
  Paragraph: styled.Paragraph,
  Link: styled.Link,
  ListItem: styled.ListItem,
  Strong: styled.Strong,
  Em: styled.Em,
  Blockquote: styled.Blockquote,
  Hr: styled.Hr,
  Table: styled.Table,
  Th: styled.Th,
  Td: styled.Td,
};

export type MarkdocComponents = typeof markdocComponents;
