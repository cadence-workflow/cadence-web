// Copyright (c) 2022 Uber Technologies Inc.
//
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const RANGE_OPTIONS = [
  { text: 'Last 10 minutes', value: 'last-10-minutes', daysAgo: 0.007 },
  { text: 'Last 60 minutes', value: 'last-60-minutes', daysAgo: 0.041 },
  { text: 'Last 3 hours', value: 'last-3-hours', daysAgo: 0.125 },
  { text: 'Last 24 hours', value: 'last-24-hours', daysAgo: 1 },
  { text: 'Last 3 days', value: 'last-3-days', daysAgo: 3 },
  { text: 'Last 7 days', value: 'last-7-days', daysAgo: 7 },
  { text: 'Last 30 days', value: 'last-30-days', daysAgo: 30 },
  { text: 'Last 3 months', value: 'last-3-months', daysAgo: 90 },
];
