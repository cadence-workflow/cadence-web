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

import {
  FILTER_MODE_ADVANCED,
  FILTER_MODE_BASIC,
  STATUS_CLOSED,
} from '../constants';
import getCriteria from './get-criteria';

describe('getCriteria', () => {
  describe('when startTime = null and endTime = "2021-05-19T06:59:59.999Z"', () => {
    const endTime = '2021-05-19T06:59:59.999Z';
    const startTime = null;

    it('should return null.', () => {
      const output = getCriteria({ endTime, startTime });

      expect(output).toEqual(null);
    });
  });

  describe('when endTime = null and startTime = "2021-05-15T07:00:00.000Z"', () => {
    const endTime = null;
    const startTime = '2021-05-15T07:00:00.000Z';

    it('should return null.', () => {
      const output = getCriteria({ endTime, startTime });

      expect(output).toEqual(null);
    });
  });

  describe('when startTime = "2021-05-15T07:00:00.000Z", endTime = "2021-05-19T06:59:59.999Z",', () => {
    const endTime = '2021-05-19T06:59:59.999Z';
    const startTime = '2021-05-15T07:00:00.000Z';

    describe('filterMode = FILTER_MODE_ADVANCED and queryString = " WorkflowID = 1234 "', () => {
      const filterMode = FILTER_MODE_ADVANCED;
      const queryString = ' WorkflowID = 1234 ';

      it('should return { queryString: "WorkflowID = 1234" }.', () => {
        const output = getCriteria({
          endTime,
          filterMode,
          queryString,
          startTime,
        });

        expect(output).toEqual({ queryString: 'WorkflowID = 1234' });
      });
    });

    describe('filterMode = FILTER_MODE_BASIC, status = STATUS_CLOSED', () => {
      const filterMode = FILTER_MODE_BASIC;
      const status = STATUS_CLOSED;

      it('should return an object with only these fields. workflowId and workflowName keys should not be defined on the object.', () => {
        const output = getCriteria({ endTime, filterMode, startTime, status });

        expect(output).toEqual({
          endTime,
          startTime,
          status,
        });
      });

      describe(', workflowId = " 1234 " and workflowName = " workflow-name "', () => {
        const workflowId = ' 1234 ';
        const workflowName = ' workflow-name ';

        it('should return an object with these fields plus workflowId and workflowName are trimmed.', () => {
          const output = getCriteria({
            endTime,
            filterMode,
            startTime,
            status,
            workflowId,
            workflowName,
          });

          expect(output).toEqual({
            endTime,
            startTime,
            status,
            workflowId: '1234',
            workflowName: 'workflow-name',
          });
        });
      });
    });
  });
});
