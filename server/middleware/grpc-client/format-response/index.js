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

const formatDurationToSeconds = require('./format-duration-to-seconds');
const formatEnum = require('./format-enum');
const formatHistoryEventDetails = require('./format-history-event-details');
const formatHistoryEventType = require('./format-history-event-type');
const formatResponseDefault = require('./format-response-default');
const formatResponseDescribeTaskList = require('./format-response-describe-task-list');
const formatResponseDescribeWorkflow = require('./format-response-describe-workflow');
const formatResponseDomain = require('./format-response-domain');
const formatResponseExportHistory = require('./format-response-export-history');
const formatResponseGetHistory = require('./format-response-get-history');
const formatResponseListDomains = require('./format-response-list-domains');
const formatResponseQueryWorkflow = require('./format-response-query-workflow');
const formatResponseSignalWorkflowExecution = require('./format-response-signal-workflow-execution');
const formatResponseTerminateWorkflowExecution = require('./format-response-terminate-workflow-execution');
const formatResponseWorkflowList = require('./format-response-workflow-list');
const formatTimestampToDatetime = require('./format-timestamp-to-datetime');
const formatTimestampToLong = require('./format-timestamp-to-long');

module.exports = {
  formatDurationToSeconds,
  formatEnum,
  formatHistoryEventDetails,
  formatHistoryEventType,
  formatResponseDefault,
  formatResponseDescribeTaskList,
  formatResponseDescribeWorkflow,
  formatResponseDomain,
  formatResponseExportHistory,
  formatResponseGetHistory,
  formatResponseListDomains,
  formatResponseQueryWorkflow,
  formatResponseSignalWorkflowExecution,
  formatResponseTerminateWorkflowExecution,
  formatResponseWorkflowList,
  formatTimestampToDatetime,
  formatTimestampToLong,
};
