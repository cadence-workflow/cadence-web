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

import {
  DATE_FORMAT_MMM_D_YYYY,
  DATE_FORMAT_D_MMM_YYYY,
  DATE_FORMAT_YYYY_MM_DD,
  TIME_FORMAT_12,
  TIME_FORMAT_24,
  TIMEZONE_LOCAL,
  TIMEZONE_UTC,
} from '../constants';
import getDateTimeFormattedString, {
  getDateFormat,
  getTimeFormat,
  getDateTimeFormat,
} from './get-datetime-formatted-string';

describe('getDateTimeFormattedString', () => {
  describe('getDateFormat', () => {
    it('should return "YYYY-MM-DD" when dateFormat = DATE_FORMAT_YYYY_MM_DD.', () => {
      const dateFormat = DATE_FORMAT_YYYY_MM_DD;
      const output = getDateFormat(dateFormat);

      expect(output).toEqual('YYYY-MM-DD');
    });

    it('should return "D MMM, YYYY" when dateFormat = DATE_FORMAT_D_MMM_YYYY.', () => {
      const dateFormat = DATE_FORMAT_D_MMM_YYYY;
      const output = getDateFormat(dateFormat);

      expect(output).toEqual('D MMM, YYYY');
    });

    it('should return "MMM D, YYYY" when dateFormat = DATE_FORMAT_MMM_D_YYYY.', () => {
      const dateFormat = DATE_FORMAT_MMM_D_YYYY;
      const output = getDateFormat(dateFormat);

      expect(output).toEqual('MMM D, YYYY');
    });
  });

  describe('getTimeFormat', () => {
    it('should return "HH:mm:ss" when timeFormat = TIME_FORMAT_24.', () => {
      const timeFormat = TIME_FORMAT_24;
      const output = getTimeFormat(timeFormat);

      expect(output).toEqual('HH:mm:ss');
    });

    it('should return "h:mm:ss A" when timeFormat = TIME_FORMAT_12.', () => {
      const timeFormat = TIME_FORMAT_12;
      const output = getTimeFormat(timeFormat);

      expect(output).toEqual('h:mm:ss A');
    });
  });

  describe('getDateTimeFormat', () => {
    it('should return "YYYY-MM-DD HH:mm:ss" when dateFormat = DATE_FORMAT_YYYY_MM_DD and timeFormat = TIME_FORMAT_24.', () => {
      const dateFormat = DATE_FORMAT_YYYY_MM_DD;
      const timeFormat = TIME_FORMAT_24;
      const output = getDateTimeFormat(dateFormat, timeFormat);

      expect(output).toEqual('YYYY-MM-DD HH:mm:ss');
    });

    it('should return "D MMM, YYYY h:mm:ss A" when dateFormat = DATE_FORMAT_D_MMM_YYYY and timeFormat = TIME_FORMAT_12.', () => {
      const dateFormat = DATE_FORMAT_D_MMM_YYYY;
      const timeFormat = TIME_FORMAT_12;
      const output = getDateTimeFormat(dateFormat, timeFormat);

      expect(output).toEqual('D MMM, YYYY h:mm:ss A');
    });
  });

  describe('getDateTimeFormattedString', () => {
    it('should return "2020-01-01 00:00:00" when date = Date("2020-01-01T00:00:00.000Z"), dateFormat = DATE_FORMAT_YYYY_MM_DD, timeFormat = TIME_FORMAT_24, timezone = TIMEZONE_UTC.', () => {
      const date = new Date('2020-01-01T00:00:00.000Z');
      const dateFormat = DATE_FORMAT_YYYY_MM_DD;
      const timeFormat = TIME_FORMAT_24;
      const timezone = TIMEZONE_UTC;
      const output = getDateTimeFormattedString({
        date,
        dateFormat,
        timeFormat,
        timezone,
      });

      expect(output).toEqual('2020-01-01 00:00:00');
    });

    it('should return "1 Jan, 2020 12:00:00 AM" when date = Date("2020-01-01T00:00:00.000Z"), dateFormat = DATE_FORMAT_D_MMM_YYYY, timeFormat = TIME_FORMAT_12, timezone = TIMEZONE_LOCAL.', () => {
      const date = new Date('2020-01-01T00:00:00.000Z');
      const dateFormat = DATE_FORMAT_D_MMM_YYYY;
      const timeFormat = TIME_FORMAT_12;
      const timezone = TIMEZONE_LOCAL;
      const output = getDateTimeFormattedString({
        date,
        dateFormat,
        timeFormat,
        timezone,
      });

      expect(output).toEqual('1 Jan, 2020 12:00:00 AM');
    });
  });
});
