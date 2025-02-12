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

const isString = require('lodash.isstring');
const { STATE_TO_FILTER_BY_MAP } = require('../constants');

const getStatusQueryValue = status => {
  if (isString(status)) {
    return `"${status}"`;
  } else if (Number.isInteger(status)) {
    return `${status}`;
  } // stringify value to convert 0 to none falsy value 0 -> "0"

  return '';
};

const buildQueryString = (
  startTime,
  endTime,
  { isCron, state = 'closed', status, workflowId, workflowName, filterBy } = {}
) => {
  const filterByField = filterBy || STATE_TO_FILTER_BY_MAP[state];
  const statusQueryValue = getStatusQueryValue(status);

  return [
    `${filterByField} >= "${startTime.toISOString()}"`,
    `${filterByField} <= "${endTime.toISOString()}"`,
    state === 'open' && `CloseTime = missing`,
    statusQueryValue && `CloseStatus = ${statusQueryValue}`,
    isCron !== undefined && `IsCron = "${isCron}"`,
    workflowId && `WorkflowID = "${workflowId}"`,
    workflowName && `WorkflowType = "${workflowName}"`,
  ]
    .filter(subQuery => !!subQuery)
    .join(' and ');
};

module.exports = buildQueryString;
