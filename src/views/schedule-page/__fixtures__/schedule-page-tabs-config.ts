import { createElement } from 'react';

import { type SchedulePageTabsConfig } from '../schedule-page-tabs/schedule-page-tabs.types';

export const mockSchedulePageTabsConfig: SchedulePageTabsConfig<
  'details' | 'runs'
> = {
  details: {
    title: 'Schedule details',
    artwork: () => createElement('div', { 'data-testid': 'details-artwork' }),
    content: () => createElement('div', { 'data-testid': 'details-content' }),
    getErrorConfig: () => ({ message: 'details error' }),
  },
  runs: {
    title: 'Runs',
    artwork: () => createElement('div', { 'data-testid': 'runs-artwork' }),
    content: () => createElement('div', { 'data-testid': 'runs-content' }),
    getErrorConfig: () => ({ message: 'runs error' }),
  },
};
