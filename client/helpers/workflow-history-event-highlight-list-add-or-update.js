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

import findIndexById from './workflow-history-event-highlight-list-find-index-by-id';

const findIndexByTypeAndParamName = ({
  eventType,
  eventParamName,
}) => eventParam =>
  eventParam.eventType === eventType &&
  eventParam.eventParamName === eventParamName;

const workflowHistoryEventHighlightListAddOrUpdate = ({
  eventParamName,
  eventType,
  id,
  isEnabled,
  workflowHistoryEventHighlightList,
}) => {
  const findIndexHandler = id
    ? findIndexById({ id })
    : findIndexByTypeAndParamName({ eventParamName, eventType });

  const index = workflowHistoryEventHighlightList.findIndex(findIndexHandler);

  if (index === -1) {
    return [
      {
        eventParamName,
        eventType,
        id: Date.now(),
        isEnabled,
      },
      ...workflowHistoryEventHighlightList,
    ];
  }

  const event = workflowHistoryEventHighlightList[index];

  return [
    ...workflowHistoryEventHighlightList.slice(0, index),
    {
      ...event,
      eventParamName,
      eventType,
      isEnabled,
    },
    ...workflowHistoryEventHighlightList.slice(index + 1),
  ];
};

export default workflowHistoryEventHighlightListAddOrUpdate;
