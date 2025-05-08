import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';

export type DomainPageTabErrorConfig = Omit<ErrorPanelProps, 'error' | 'reset'>;

export type Props = {
  error: Error;
  reset: () => void;
};
