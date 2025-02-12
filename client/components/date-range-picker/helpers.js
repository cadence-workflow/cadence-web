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

import moment from 'moment';
import {
  ALLOWED_PERIOD_TYPES,
  DATETIME_FORMAT,
  RANGE_OPTIONS,
} from './constants';

export const getDateString = date => moment(date).format(DATETIME_FORMAT);

export const getMaxEndDate = now => moment(now).endOf('day');

export const getRange = dateRange => {
  if (!dateRange) {
    return [];
  }

  if (typeof dateRange !== 'string') {
    return [dateRange.startTime.toDate(), dateRange.endTime.toDate()];
  }

  const [, count, unit] = dateRange.split('-');

  const startTime = moment()
    .subtract(count, unit)
    .startOf(unit)
    .toDate();

  const endTime = moment()
    .endOf(unit)
    .toDate();

  return [startTime, endTime];
};

export const getRangeDisplayText = dateRange => {
  if (!dateRange) {
    return '';
  }

  if (typeof dateRange !== 'string') {
    return `${dateRange.startTime.format(
      DATETIME_FORMAT
    )} - ${dateRange.endTime.format(DATETIME_FORMAT)}`;
  }

  const [, count, unit] = dateRange.split('-');

  const parsedCount = parseInt(count);

  if (!parsedCount) {
    return '';
  }

  if (!ALLOWED_PERIOD_TYPES.includes(unit)) {
    return '';
  }

  return `Last ${parsedCount} ${unit}`;
};

export const getShortcuts = (maxDays, minStartDate) => {
  let options = RANGE_OPTIONS;

  if (!minStartDate) {
    return options;
  }

  if (maxDays && maxDays < 90) {
    options = options.filter(o => o.daysAgo < maxDays);
    const periodType = maxDays === 1 ? 'day' : 'days';

    const option = {
      daysAgo: maxDays,
      text: `Last ${maxDays} ${periodType}`,
      value: `last-${maxDays}-${periodType}`,
    };

    options.push(option);
    options.sort((a, b) => a.daysAgo - b.daysAgo);
  }

  return options;
};

export const getTimePanelLabel = showTimePanel =>
  showTimePanel ? 'Select date' : 'Select time';

export const isDateValid = (date, minStartDate, maxEndDate) =>
  (date.isValid &&
    !date.isAfter(maxEndDate) &&
    !(minStartDate && date.isBefore(minStartDate))) ||
  false;

export const isDayDisabled = minStartDate => date => {
  const momentDate = moment(date);

  if (minStartDate) {
    if (momentDate.isBefore(minStartDate)) {
      return true;
    }
  }

  return momentDate.isAfter(moment().endOf('day'));
};
