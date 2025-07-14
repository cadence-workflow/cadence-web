import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';

export type WorkflowPageTabErrorConfig = Omit<
  ErrorPanelProps,
  'error' | 'reset'
>;

export type Props = {
  error: Error;
  reset: () => void;
};
