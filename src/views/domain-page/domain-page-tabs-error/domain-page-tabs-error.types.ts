import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';

import { type DomainTabName } from '../domain-page-content/domain-page-content.types';

export type DomainPageTabErrorConfig = Omit<ErrorPanelProps, 'error' | 'reset'>;

export type DomainPageTabsErrorConfig = Record<
  DomainTabName,
  (err: Error) => DomainPageTabErrorConfig
>;

export type Props = {
  error: Error;
  reset: () => void;
};
