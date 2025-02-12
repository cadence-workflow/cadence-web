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

const moment = require('moment');
const buildQueryString = require('./build-query-string');

describe('buildQueryString', () => {
  describe('when passed startTime, endTime', () => {
    let startTime;
    let endTime;

    beforeEach(() => {
      startTime = moment('2021-06-03T00:00:00.000Z');
      endTime = moment('2021-06-04T00:00:00.000Z');
    });

    it('should return "CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z"".', () => {
      const output = buildQueryString(startTime, endTime);

      expect(output).toEqual(
        'CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z"'
      );
    });

    describe('isCron = true', () => {
      const isCron = true;

      it('should return "CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and IsCron = "true"".', () => {
        const output = buildQueryString(startTime, endTime, { isCron });

        expect(output).toEqual(
          'CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and IsCron = "true"'
        );
      });
    });

    describe('isCron = false', () => {
      const isCron = false;

      it('should return "CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and IsCron = "false"".', () => {
        const output = buildQueryString(startTime, endTime, { isCron });

        expect(output).toEqual(
          'CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and IsCron = "false"'
        );
      });
    });

    describe('state = "all"', () => {
      const state = 'all';

      it('should return "StartTime >= "2021-06-03T00:00:00.000Z" and StartTime <= "2021-06-04T00:00:00.000Z"".', () => {
        const output = buildQueryString(startTime, endTime, { state });

        expect(output).toEqual(
          'StartTime >= "2021-06-03T00:00:00.000Z" and StartTime <= "2021-06-04T00:00:00.000Z"'
        );
      });
    });

    describe('state = "closed"', () => {
      const state = 'closed';

      it('should return "CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z"".', () => {
        const output = buildQueryString(startTime, endTime, { state });

        expect(output).toEqual(
          'CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z"'
        );
      });
    });

    describe('state = "open"', () => {
      const state = 'open';

      it('should return "StartTime >= "2021-06-03T00:00:00.000Z" and StartTime <= "2021-06-04T00:00:00.000Z" and CloseTime = missing".', () => {
        const output = buildQueryString(startTime, endTime, { state });

        expect(output).toEqual(
          'StartTime >= "2021-06-03T00:00:00.000Z" and StartTime <= "2021-06-04T00:00:00.000Z" and CloseTime = missing'
        );
      });
    });

    describe('status = "Completed"', () => {
      const status = 'Completed';

      it('should return "CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and CloseStatus = "Completed"".', () => {
        const output = buildQueryString(startTime, endTime, { status });

        expect(output).toEqual(
          'CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and CloseStatus = "Completed"'
        );
      });
    });

    describe('archival status, status = 0', () => {
      const status = 0;

      it('should return "CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and CloseStatus = 0".', () => {
        const output = buildQueryString(startTime, endTime, { status });

        expect(output).toEqual(
          'CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and CloseStatus = 0'
        );
      });
    });

    describe('archival status, status = 1', () => {
      const status = 1;

      it('should return "CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and CloseStatus = 1".', () => {
        const output = buildQueryString(startTime, endTime, { status });

        expect(output).toEqual(
          'CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and CloseStatus = 1'
        );
      });
    });

    describe('workflowId = "wf-id"', () => {
      const workflowId = 'wf-id';

      it('should return "CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and WorkflowID = "wf-id"".', () => {
        const output = buildQueryString(startTime, endTime, { workflowId });

        expect(output).toEqual(
          'CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and WorkflowID = "wf-id"'
        );
      });
    });

    describe('workflowName = "wf-name"', () => {
      const workflowName = 'wf-name';

      it('should return "CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and WorkflowType = "wf-name"".', () => {
        const output = buildQueryString(startTime, endTime, { workflowName });

        expect(output).toEqual(
          'CloseTime >= "2021-06-03T00:00:00.000Z" and CloseTime <= "2021-06-04T00:00:00.000Z" and WorkflowType = "wf-name"'
        );
      });
    });
  });
});
