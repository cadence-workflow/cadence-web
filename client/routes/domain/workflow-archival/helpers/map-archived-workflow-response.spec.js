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

import mapArchivedWorkflowResponse from './map-archived-workflow-response';

describe('mapArchivedWorkflowResponse', () => {
  it('should return a flattened results array when passed executions with 1 item', () => {
    const results = [
      {
        closeStatus: 'closeStatusValue',
        closeTime: '2020-03-30T00:00:00Z',
        execution: {
          runId: 'runIdValue',
          workflowId: 'workflowIdValue',
        },
        startTime: '2020-03-01T00:00:00Z',
        type: {
          name: 'workflowNameValue',
        },
      },
    ];
    const output = mapArchivedWorkflowResponse({ results });

    expect(output[0].closeStatus).toEqual('closeStatusValue');
    expect(output[0].closeTime).toEqual('Mar 30, 2020 12:00:00 AM');
    expect(output[0].runId).toEqual('runIdValue');
    expect(output[0].startTime).toEqual('Mar 1, 2020 12:00:00 AM');
    expect(output[0].workflowId).toEqual('workflowIdValue');
    expect(output[0].workflowName).toEqual('workflowNameValue');
  });
});
