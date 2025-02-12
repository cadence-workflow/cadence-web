// Copyright (c) 2021-2025 Uber Technologies Inc.
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

import { STATUS_COMPLETED } from '../constants';
import getFormattedResults from './get-formatted-results';
import {
  DATE_FORMAT_YYYY_MM_DD,
  DATE_FORMAT_MMM_D_YYYY,
  TIME_FORMAT_12,
  TIME_FORMAT_24,
  TIMEZONE_LOCAL,
  TIMEZONE_UTC,
} from '~constants';

describe('getFormattedResults', () => {
  const resultWithoutCloseStatus = {
    execution: {
      runId: 'run_id_5678',
      workflowId: 'wf_id_1234',
    },
    startTime: '2021-05-15T07:00:00.000Z',
    type: {
      name: 'wf_name',
    },
  };

  const resultWithCloseStatus = {
    ...resultWithoutCloseStatus,
    closeTime: '2021-05-19T06:59:59.999Z',
    closeStatus: STATUS_COMPLETED,
  };

  describe('results = [resultWithoutCloseStatus], dateFormat = DATE_FORMAT_YYYY_MM_DD, timeFormat = TIME_FORMAT_12 and timezone = TIMEZONE_LOCAL', () => {
    const results = [resultWithoutCloseStatus];
    const dateFormat = DATE_FORMAT_YYYY_MM_DD;
    const timeFormat = TIME_FORMAT_12;
    const timezone = TIMEZONE_LOCAL;

    it('should format the results with the specified formats for startTime and endTime = "".', () => {
      const output = getFormattedResults({
        dateFormat,
        results,
        timeFormat,
        timezone,
      });

      expect(output).toEqual([
        {
          endTime: '',
          runId: 'run_id_5678',
          startTime: '2021-05-15 7:00:00 AM',
          status: 'open',
          uniqueId: 'run_id_5678-open',
          workflowId: 'wf_id_1234',
          workflowName: 'wf_name',
        },
      ]);
    });
  });

  describe('results = [resultWithCloseStatus], dateFormat = DATE_FORMAT_MMM_D_YYYY, timeFormat = TIME_FORMAT_24 and timezone = TIMEZONE_UTC', () => {
    const results = [resultWithCloseStatus];
    const dateFormat = DATE_FORMAT_MMM_D_YYYY;
    const timeFormat = TIME_FORMAT_24;
    const timezone = TIMEZONE_UTC;

    it('should format the results with the specified formats for startTime and endTime.', () => {
      const output = getFormattedResults({
        dateFormat,
        results,
        timeFormat,
        timezone,
      });

      expect(output).toEqual([
        {
          endTime: 'May 19, 2021 06:59:59',
          runId: 'run_id_5678',
          startTime: 'May 15, 2021 07:00:00',
          status: 'completed',
          uniqueId: 'run_id_5678-completed',
          workflowId: 'wf_id_1234',
          workflowName: 'wf_name',
        },
      ]);
    });
  });
});
