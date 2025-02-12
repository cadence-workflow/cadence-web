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

const clearCacheHandler = require('./clear-cache-handler');
const clusterHandler = require('./cluster-handler');
const domainAuthorizationHandler = require('./domain-authorization-handler');
const domainHandler = require('./domain-handler');
const domainListHandler = require('./domain-list-handler');
const featureFlagHandler = require('./feature-flag-handler');
const healthHandler = require('./health-handler');
const tasklistHandler = require('./tasklist-handler');
const tasklistPartitionListHandler = require('./tasklist-partition-list-handler');
const tasklistPollerListHandler = require('./tasklist-poller-list-handler');
const workflowArchivedListHandler = require('./workflow-archived-list-handler');
const workflowExportHandler = require('./workflow-export-handler');
const workflowHandler = require('./workflow-handler');
const workflowHistoryHandler = require('./workflow-history-handler');
const workflowListHandler = require('./workflow-list-handler');
const workflowQueryHandler = require('./workflow-query-handler');
const workflowQueryTypeHandler = require('./workflow-query-type-handler');
const workflowSignalHandler = require('./workflow-signal-handler');
const workflowTerminateHandler = require('./workflow-terminate-handler');

module.exports = {
  clearCacheHandler,
  clusterHandler,
  domainAuthorizationHandler,
  domainHandler,
  domainListHandler,
  featureFlagHandler,
  healthHandler,
  tasklistHandler,
  tasklistPartitionListHandler,
  tasklistPollerListHandler,
  workflowArchivedListHandler,
  workflowExportHandler,
  workflowHandler,
  workflowHistoryHandler,
  workflowListHandler,
  workflowQueryHandler,
  workflowQueryTypeHandler,
  workflowSignalHandler,
  workflowTerminateHandler,
};
