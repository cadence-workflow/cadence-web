import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';

import { type WorkflowPageTabName } from '../workflow-page-tab-content/workflow-page-tab-content.types';

export type WorkflowPageTabErrorConfig = Omit<
  ErrorPanelProps,
  'error' | 'reset'
>;

export type WorkflowPageTabsErrorConfig = Record<
  WorkflowPageTabName,
  (err: Error) => WorkflowPageTabErrorConfig
>;

export type Props = {
  error: Error;
  reset: () => void;
};
