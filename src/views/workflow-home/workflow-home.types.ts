import { type WorkflowPageTabContentProps } from '../workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

export type Props = WorkflowPageTabContentProps;

export type WorkflowHomeState =
  | { state: 'loading' }
  | { state: 'disabled' }
  | { state: 'archived' }
  | { state: 'not-set-up' }
  | { state: 'error'; description: string }
  | { state: 'invalid-format'; description: string }
  | { state: 'ready'; content: string; title?: string };

export type HomePage = {
  content: string;
  title?: string;
};
