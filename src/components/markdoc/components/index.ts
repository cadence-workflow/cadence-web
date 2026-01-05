import SignalButton from '@/components/signal-button/signal-button';
import StartWorkflowButton from '@/components/start-workflow-button/start-workflow-button';

import CodeBlock from './code-block/code-block';
import Heading from './heading/heading';
import InlineCode from './inline-code/inline-code';
import List from './list/list';

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
