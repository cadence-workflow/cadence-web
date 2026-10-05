import { type Props as ErrorPanelProps } from '@/components/error-panel/error-panel.types';

import { type SchedulePageTabsParams } from '../schedule-page-tabs/schedule-page-tabs.types';

export type SchedulePageTabErrorConfig = Omit<
  ErrorPanelProps,
  'error' | 'reset'
>;

export type GetSchedulePageTabErrorConfig = (
  error: Error,
  params: SchedulePageTabsParams
) => SchedulePageTabErrorConfig;

export type Props = {
  error: Error;
  reset: () => void;
};
