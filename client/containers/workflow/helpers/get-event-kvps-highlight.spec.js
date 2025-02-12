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

import getEventKvpsHighlight from './get-event-kvps-highlight';

describe('getEventKvpsHighlight', () => {
  it('should return isHighlighted = false when workflowHistoryEventHighlightListEnabled = false.', () => {
    const output = getEventKvpsHighlight({
      eventType: 'ActivityTaskScheduled',
      kvps: [],
      workflowHistoryEventHighlightList: [],
      workflowHistoryEventHighlightListEnabled: false,
    });

    expect(output).toEqual({
      kvps: [],
      isHighlighted: false,
    });
  });

  it('should return isHighlighted = false when workflowHistoryEventHighlightListEnabled = true and workflowHistoryEventHighlightList items are not enabled.', () => {
    const workflowHistoryEventHighlightList = [
      {
        eventType: 'ActivityTaskScheduled',
        eventParamName: 'eventId',
        isEnabled: false,
      },
    ];

    const output = getEventKvpsHighlight({
      eventType: 'ActivityTaskScheduled',
      kvps: [],
      workflowHistoryEventHighlightList,
      workflowHistoryEventHighlightListEnabled: true,
    });

    expect(output).toEqual({
      kvps: [],
      isHighlighted: false,
    });
  });

  it('should return isHighlighted = true and kvp.isHighlighted = true when workflowHistoryEventHighlightListEnabled = true and workflowHistoryEventHighlightList items are matching and enabled.', () => {
    const workflowHistoryEventHighlightList = [
      {
        eventType: 'ActivityTaskScheduled',
        eventParamName: 'eventId',
        isEnabled: true,
      },
    ];
    const kvps = [
      {
        key: 'eventId',
        value: 1,
      },
      {
        key: 'scheduledEventId',
        value: 0,
      },
    ];

    const output = getEventKvpsHighlight({
      eventType: 'ActivityTaskScheduled',
      kvps,
      workflowHistoryEventHighlightList,
      workflowHistoryEventHighlightListEnabled: true,
    });

    expect(output).toEqual({
      kvps: [
        {
          isHighlighted: true,
          key: 'eventId',
          value: 1,
        },
        {
          isHighlighted: false,
          key: 'scheduledEventId',
          value: 0,
        },
      ],
      isHighlighted: true,
    });
  });

  it('should return isHighlighted = false and kvp.isHighlighted = false when workflowHistoryEventHighlightListEnabled = true and workflowHistoryEventHighlightList items are not matching and enabled.', () => {
    const workflowHistoryEventHighlightList = [
      {
        eventType: 'ActivityTaskScheduled',
        eventParamName: 'eventId',
        isEnabled: true,
      },
    ];
    const kvps = [
      {
        key: 'scheduledEventId',
        value: 0,
      },
    ];

    const output = getEventKvpsHighlight({
      eventType: 'ActivityTaskScheduled',
      kvps,
      workflowHistoryEventHighlightList,
      workflowHistoryEventHighlightListEnabled: true,
    });

    expect(output).toEqual({
      kvps: [
        {
          isHighlighted: false,
          key: 'scheduledEventId',
          value: 0,
        },
      ],
      isHighlighted: false,
    });
  });
});
