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

import remove from './workflow-history-event-highlight-list-remove';

describe('workflowHistoryEventHighlightListRemove', () => {
  it('list is unchanged when no item with id = 1 in list and passed id = 1.', () => {
    const workflowHistoryEventHighlightList = [
      { id: 0 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];

    const output = remove({
      id: 1,
      workflowHistoryEventHighlightList,
    });

    expect(output).toEqual(workflowHistoryEventHighlightList);
  });

  it('removes item with id = 1 from list when passed id = 1.', () => {
    const workflowHistoryEventHighlightList = [
      { id: 0 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];

    const output = remove({
      id: 1,
      workflowHistoryEventHighlightList,
    });

    expect(output).toEqual([{ id: 0 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  });
});
