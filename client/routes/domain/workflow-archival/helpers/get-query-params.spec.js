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

import getQueryParams from './get-query-params';

describe('getQueryParams', () => {
  describe('When startTime = undefined and endTime = "2020-03-30T00:00:00Z"', () => {
    it('should return null.', () => {
      const startTime = undefined;
      const endTime = '2020-03-30T00:00:00Z';
      const output = getQueryParams({ endTime, startTime });

      expect(output).toEqual(null);
    });
  });

  describe('When startTime = "2020-03-01T00:00:00Z" and endTime = undefined', () => {
    it('should return null.', () => {
      const startTime = '2020-03-01T00:00:00Z';
      const endTime = undefined;
      const output = getQueryParams({ endTime, startTime });

      expect(output).toEqual(null);
    });
  });

  describe('When startTime = "2020-03-01T00:00:00Z" and endTime = "2020-03-30T00:00:00Z"', () => {
    let startTime;
    let endTime;

    beforeEach(() => {
      startTime = '2020-03-01T00:00:00Z';
      endTime = '2020-03-30T00:00:00Z';
    });

    it('should return startTime.', () => {
      const output = getQueryParams({ endTime, startTime });

      expect(output.startTime).toEqual(startTime);
    });

    it('should return endTime.', () => {
      const output = getQueryParams({ endTime, startTime });

      expect(output.endTime).toEqual(endTime);
    });

    describe('and statusValue = "-1"', () => {
      it('should not include status.', () => {
        const statusValue = '-1';
        const output = getQueryParams({ endTime, startTime, statusValue });

        expect(output.status).toEqual(undefined);
      });
    });

    describe('and statusValue = "0"', () => {
      it('should return status = "0".', () => {
        const statusValue = '0';
        const output = getQueryParams({ endTime, startTime, statusValue });

        expect(output.status).toEqual('0');
      });
    });

    describe('and workflowId = "abcd"', () => {
      it('should return workflowId = "abcd".', () => {
        const workflowId = 'abcd';
        const output = getQueryParams({ endTime, startTime, workflowId });

        expect(output.workflowId).toEqual('abcd');
      });
    });

    describe('and workflowName = "workflow.name"', () => {
      it('should return workflowName = "workflow.name".', () => {
        const workflowName = 'workflow.name';
        const output = getQueryParams({ endTime, startTime, workflowName });

        expect(output.workflowName).toEqual('workflow.name');
      });
    });
  });
});
