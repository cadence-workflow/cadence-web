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
  DATE_FORMAT_YYYY_MM_DD,
  DATE_FORMAT_MMM_D_YYYY,
  DATE_FORMAT_D_MMM_YYYY,
  TIME_FORMAT_12,
  TIME_FORMAT_24,
  TIMEZONE_LOCAL,
  TIMEZONE_UTC,
} from '../constants';

export const getDateFormat = dateFormat => {
  switch (dateFormat) {
    case DATE_FORMAT_YYYY_MM_DD:
      return 'YYYY-MM-DD';
    case DATE_FORMAT_D_MMM_YYYY:
      return 'D MMM, YYYY';
    case DATE_FORMAT_MMM_D_YYYY:
    default:
      return 'MMM D, YYYY';
  }
};

export const getTimeFormat = timeFormat => {
  switch (timeFormat) {
    case TIME_FORMAT_24:
      return 'HH:mm:ss';
    case TIME_FORMAT_12:
    default:
      return 'h:mm:ss A';
  }
};

export const getDateTimeFormat = (dateFormat, timeFormat) =>
  `${getDateFormat(dateFormat)} ${getTimeFormat(timeFormat)}`;

export const getMomentFn = timezone => {
  switch (timezone) {
    case TIMEZONE_UTC:
      return moment.utc;
    case TIMEZONE_LOCAL:
    default:
      return moment;
  }
};

export default ({ date, dateFormat, timeFormat, timezone }) => {
  const dateTimeFormat = getDateTimeFormat(dateFormat, timeFormat);
  const momentFn = getMomentFn(timezone);

  return momentFn(date).format(dateTimeFormat);
};
