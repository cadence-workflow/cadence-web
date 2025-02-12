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
import { getKeyValuePairs } from '~helpers';

const getEventDetails = ({
  clusterName,
  event,
  workflowHistoryEventHighlightList = [],
  workflowHistoryEventHighlightListEnabled = false,
}) => {
  const { details, eventId, eventType, timeStampDisplay } = event;

  const { kvps, isHighlighted } = getEventKvpsHighlight({
    eventType,
    kvps: getKeyValuePairs({
      clusterName,
      item: {
        timestamp: timeStampDisplay,
        eventId,
        ...details,
      },
    }),
    workflowHistoryEventHighlightList,
    workflowHistoryEventHighlightListEnabled,
  });

  return {
    ...details,
    eventId,
    eventType,
    isHighlighted,
    kvps,
    timestamp: timeStampDisplay,
  };
};

export default getEventDetails;
