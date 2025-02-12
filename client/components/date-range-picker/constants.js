// Copyright (c) 2017-2025 Uber Technologies Inc.
//
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

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
