import { createElement } from 'react';

import { type SchedulePageTabsConfig } from '../schedule-page-tabs/schedule-page-tabs.types';

export const mockSchedulePageTabsConfig: SchedulePageTabsConfig<
  'details' | 'runs'
> = {
  details: {
    title: 'Schedule details',
    artwork: () => createElement('div', { 'data-testid': 'details-artwork' }),
  },
  runs: {
    title: 'Runs',
    artwork: () => createElement('div', { 'data-testid': 'runs-artwork' }),
  },
};
