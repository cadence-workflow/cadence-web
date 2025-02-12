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

import addOrUpdate from './workflow-history-event-highlight-list-add-or-update';

describe('workflowHistoryEventHighlightListAddOrUpdate', () => {
  it('should add an item to start of list if not found with id = 1.', () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => 1);

    const workflowHistoryEventHighlightList = [
      {
        id: 0,
        eventParamName: 'eventId',
        eventType: 'ActivityTaskCanceled',
        isEnabled: false,
      },
      {
        id: 2,
        eventParamName: 'eventId',
        eventType: 'ActivityTaskCompleted',
        isEnabled: false,
      },
      {
        id: 3,
        eventParamName: 'eventId',
        eventType: 'DecisionTaskCompleted',
        isEnabled: false,
      },
      {
        id: 4,
        eventParamName: 'eventId',
        eventType: 'DecisionTaskScheduled',
        isEnabled: false,
      },
    ];

    const output = addOrUpdate({
      eventParamName: 'eventId',
      eventType: 'ActivityTaskScheduled',
      id: 1,
      isEnabled: true,
      workflowHistoryEventHighlightList,
    });

    expect(output.length).toEqual(5);
    expect(output[0]).toEqual({
      eventParamName: 'eventId',
      eventType: 'ActivityTaskScheduled',
      id: 1,
      isEnabled: true,
    });
  });

  it('should update item in list with id = 1.', () => {
    const workflowHistoryEventHighlightList = [
      {
        id: 0,
        eventParamName: 'eventId',
        eventType: 'ActivityTaskCanceled',
        isEnabled: false,
      },
      {
        id: 1,
        eventParamName: 'eventId',
        eventType: 'ActivityTaskScheduled',
        isEnabled: false,
      },
      {
        id: 2,
        eventParamName: 'eventId',
        eventType: 'ActivityTaskCompleted',
        isEnabled: false,
      },
      {
        id: 3,
        eventParamName: 'eventId',
        eventType: 'DecisionTaskCompleted',
        isEnabled: false,
      },
      {
        id: 4,
        eventParamName: 'eventId',
        eventType: 'DecisionTaskScheduled',
        isEnabled: false,
      },
    ];

    const output = addOrUpdate({
      eventParamName: 'eventId',
      eventType: 'ActivityTaskScheduled',
      id: 1,
      isEnabled: true,
      workflowHistoryEventHighlightList,
    });

    expect(output.length).toEqual(5);
    expect(output[1]).toEqual({
      eventParamName: 'eventId',
      eventType: 'ActivityTaskScheduled',
      id: 1,
      isEnabled: true,
    });
  });

  it('should update item in list with eventType = "ActivityTaskScheduled" and eventParamName = "eventId" (no id specified).', () => {
    const workflowHistoryEventHighlightList = [
      {
        id: 0,
        eventParamName: 'eventId',
        eventType: 'ActivityTaskCanceled',
        isEnabled: false,
      },
      {
        id: 1,
        eventParamName: 'eventId',
        eventType: 'ActivityTaskScheduled',
        isEnabled: false,
      },
      {
        id: 2,
        eventParamName: 'eventId',
        eventType: 'ActivityTaskCompleted',
        isEnabled: false,
      },
      {
        id: 3,
        eventParamName: 'eventId',
        eventType: 'DecisionTaskCompleted',
        isEnabled: false,
      },
      {
        id: 4,
        eventParamName: 'eventId',
        eventType: 'DecisionTaskScheduled',
        isEnabled: false,
      },
    ];

    const output = addOrUpdate({
      eventParamName: 'eventId',
      eventType: 'ActivityTaskScheduled',
      isEnabled: true,
      workflowHistoryEventHighlightList,
    });

    expect(output.length).toEqual(5);
    expect(output[1]).toEqual({
      eventParamName: 'eventId',
      eventType: 'ActivityTaskScheduled',
      id: 1,
      isEnabled: true,
    });
  });
});
