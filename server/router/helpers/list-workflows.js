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

const moment = require('moment');
const buildQueryString = require('./build-query-string');
const injectDomainIntoWorkflowList = require('./inject-domain-into-workflow-list');
const isAdvancedVisibilityEnabled = require('./is-advanced-visibility-enabled');
const momentToLong = require('./moment-to-long');

async function listWorkflows({ clusterService, state }, ctx) {
  const { params = {}, query = {} } = ctx;
  const startTime = moment(query.startTime || NaN);
  const endTime = moment(query.endTime || NaN);

  ctx.assert(startTime.isValid() && endTime.isValid(), 400);

  const cluster = await clusterService.getCluster(ctx);

  const advancedVisibility = isAdvancedVisibilityEnabled(cluster);

  if (state === 'all') {
    ctx.assert(
      advancedVisibility,
      'Advanced visibility is not supported for cluster. Try using workflows open or closed APIs.',
      400
    );
  }

  const earliestTime = momentToLong(startTime);
  const latestTime = momentToLong(endTime);
  const { nextPageToken, status, workflowId, workflowName } = query;

  const requestArgs = advancedVisibility
    ? {
        query: buildQueryString(startTime, endTime, {
          ...query,
          state,
        }),
      }
    : {
        StartTimeFilter: {
          earliestTime,
          latestTime,
        },
        ...(workflowName && { typeFilter: { name: workflowName } }),
        ...(workflowId && { executionFilter: { workflowId } }),
        ...(status && { statusFilter: status }),
        nextPageToken,
      };

  const requestApi = advancedVisibility ? 'listWorkflows' : state + 'Workflows';

  const workflowListResponse = await ctx.cadence[requestApi](requestArgs);

  workflowListResponse.executions = injectDomainIntoWorkflowList(
    params.domain,
    workflowListResponse
  );

  ctx.body = workflowListResponse;
}

module.exports = listWorkflows;
