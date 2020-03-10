export const ALLOWED_PERIOD_TYPES = [
  'second',
  'seconds',
  'minute',
  'minutes',
  'hour',
  'hours',
  'day',
  'days',
  'month',
  'months',
];

export const DATETIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';

export const RANGE_OPTIONS = [
  { text: 'Last 1 second', value: 'last-1-second', daysAgo: 0.00001 },
  { text: 'Last 10 seconds', value: 'last-10-seconds', daysAgo: 0.0001 },
  { text: 'Last 60 seconds', value: 'last-60-seconds', daysAgo: 0.0007 },
  { text: 'Last 10 minutes', value: 'last-10-minutes', daysAgo: 0.007 },
  { text: 'Last 60 minutes', value: 'last-60-minutes', daysAgo: 0.041 },
  { text: 'Last 3 hours', value: 'last-3-hours', daysAgo: 0.125 },
  { text: 'Last 24 hours', value: 'last-24-hours', daysAgo: 1 },
  { text: 'Last 3 days', value: 'last-3-days', daysAgo: 3 },
  { text: 'Last 7 days', value: 'last-7-days', daysAgo: 7 },
  { text: 'Last 30 days', value: 'last-30-days', daysAgo: 30 },
  { text: 'Last 3 months', value: 'last-3-months', daysAgo: 90 },
];
