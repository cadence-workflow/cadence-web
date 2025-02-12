// Copyright (c) 2017-2025 Uber Technologies Inc.
// Portions of the Software are attributed to Copyright (c) 2020-2024 Temporal Technologies Inc.
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

const Router = require('koa-router');

const {
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
} = require('./routes');
const { ONE_HOUR_IN_MILLISECONDS } = require('./constants');
const { listWorkflows } = require('./helpers');
const { CacheManager } = require('./managers');
const { ClusterService, DomainService } = require('./services');

const router = new Router();

const clusterCacheManager = new CacheManager(ONE_HOUR_IN_MILLISECONDS);
const clusterService = new ClusterService(clusterCacheManager);

const domainCacheManager = new CacheManager(ONE_HOUR_IN_MILLISECONDS);
const domainService = new DomainService(domainCacheManager);

router.get('/api/cluster', clusterHandler(clusterService));

router.delete('/api/cluster/cache', clearCacheHandler(clusterCacheManager));

router.get('/api/domains', domainListHandler(domainService));

router.delete('/api/domains/cache', clearCacheHandler(domainCacheManager));

router.get('/api/domains/:domain', domainHandler);

/**
 * Override this route to perform authorization check
 * on current user & domain they are accessing.
 *
 * Example:
 *
 * router.get('/api/domains/:domain/authorization', () => {
 *  const { domain } = ctx.params;
 *
 *  ctx.body = {
 *    // use whatever system authorization checks needed here.
 *    authorization: db.isUserAuthorizedForDomain(domain),
 *  };
 * })
 */
router.get('/api/domains/:domain/authorization', domainAuthorizationHandler);

router.get(
  '/api/domains/:domain/workflows/all',
  listWorkflows.bind(null, { clusterService, state: 'all' })
);

router.get(
  '/api/domains/:domain/workflows/open',
  listWorkflows.bind(null, { clusterService, state: 'open' })
);

router.get(
  '/api/domains/:domain/workflows/closed',
  listWorkflows.bind(null, { clusterService, state: 'closed' })
);

router.get(
  '/api/domains/:domain/workflows/archived',
  workflowArchivedListHandler
);

router.get('/api/domains/:domain/workflows/list', workflowListHandler);

router.get(
  '/api/domains/:domain/workflows/:workflowId/:runId/history',
  workflowHistoryHandler
);

router.get(
  '/api/domains/:domain/workflows/:workflowId/:runId/export',
  workflowExportHandler
);

router.get(
  '/api/domains/:domain/workflows/:workflowId/:runId/query',
  workflowQueryHandler
);

router.post(
  '/api/domains/:domain/workflows/:workflowId/:runId/query/:queryType',
  workflowQueryTypeHandler
);

router.post(
  '/api/domains/:domain/workflows/:workflowId/:runId/terminate',
  workflowTerminateHandler
);

router.post(
  '/api/domains/:domain/workflows/:workflowId/:runId/signal/:signal',
  workflowSignalHandler
);

router.get(
  '/api/domains/:domain/workflows/:workflowId/:runId',
  workflowHandler
);

router.get(
  '/api/domains/:domain/task-lists/:taskList/pollers',
  tasklistPollerListHandler
);

router.get(
  '/api/domains/:domain/task-lists/:taskList/partitions',
  tasklistPartitionListHandler
);

router.get('/api/feature-flags/:key', featureFlagHandler);

router.get('/api/domains/:domain/task-lists/:taskListName', tasklistHandler);

router.get('/health', healthHandler);

module.exports = router;
