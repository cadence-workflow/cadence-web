// Copyright (c) 2022-2024 Uber Technologies Inc.
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

import formatTimestampToDatetime from './format-timestamp-to-datetime';
import formatWorkflowHistoryEvent from './format-workflow-history-event';
import formatWorkflowHistoryEventType from './format-workflow-history-event-type';

const formatWorkflowHistory = ({
  archived,
  history: { events },
  rawHistory,
  ...response
}: any) => ({
  ...response,
  archived: archived || null,
  history: {
    events: events.map(({ eventId, eventTime, ...event }: any) => ({
      eventId: parseInt(eventId),
      timestamp: formatTimestampToDatetime(eventTime),
      eventType: formatWorkflowHistoryEventType(event.attributes),
      ...event,
      ...formatWorkflowHistoryEvent(event),
    })),
  },
  rawHistory: rawHistory?.length ? rawHistory : null,
});

export default formatWorkflowHistory;
