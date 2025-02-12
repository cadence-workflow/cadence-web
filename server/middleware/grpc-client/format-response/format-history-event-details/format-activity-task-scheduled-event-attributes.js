// Copyright (c) 2022-2025 Uber Technologies Inc.
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

const formatEnum = require('../format-enum');
const formatPayload = require('../format-payload');
const formatPayloadMap = require('../format-payload-map');
const formatDurationToSeconds = require('../format-duration-to-seconds');
const formatRetryPolicy = require('./format-retry-policy');

const formatActivityTaskScheduledEventAttributes = ({
  decisionTaskCompletedEventId,
  domain,
  header,
  heartbeatTimeout,
  input,
  retryPolicy,
  scheduleToCloseTimeout,
  scheduleToStartTimeout,
  startToCloseTimeout,
  taskList,
  ...eventAttributes
}) => ({
  ...eventAttributes,
  decisionTaskCompletedEventId: parseInt(decisionTaskCompletedEventId),
  domain: domain || null,
  header: formatPayloadMap(header, 'fields'),
  heartbeatTimeoutSeconds: formatDurationToSeconds(heartbeatTimeout),
  input: formatPayload(input),
  retryPolicy: formatRetryPolicy(retryPolicy),
  scheduleToCloseTimeoutSeconds: formatDurationToSeconds(
    scheduleToCloseTimeout
  ),
  scheduleToStartTimeoutSeconds: formatDurationToSeconds(
    scheduleToStartTimeout
  ),
  startToCloseTimeoutSeconds: formatDurationToSeconds(startToCloseTimeout),
  taskList: {
    kind: formatEnum(taskList?.kind, 'TASK_LIST_KIND'),
    name: taskList?.name || null,
  },
});

module.exports = formatActivityTaskScheduledEventAttributes;
