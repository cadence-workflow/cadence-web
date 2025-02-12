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
const {
  buildQueryString,
  injectDomainIntoWorkflowList,
} = require('../helpers');

const workflowArchivedListHandler = async ctx => {
  const { nextPageToken, ...query } = ctx.query || {};
  const { params = {} } = ctx;
  let queryString;

  if (query.queryString) {
    queryString = query.queryString;
  } else {
    const startTime = moment(query.startTime || NaN);
    const endTime = moment(query.endTime || NaN);
    const parsedStatus =
      query.status && !isNaN(query.status)
        ? parseInt(query.status)
        : query.status;

    ctx.assert(startTime.isValid() && endTime.isValid(), 400);
    queryString = buildQueryString(startTime, endTime, {
      ...query,
      status: parsedStatus,
    });
  }

  const archivedWorkflowsResponse = await ctx.cadence.archivedWorkflows({
    query: queryString,
    nextPageToken,
  });

  archivedWorkflowsResponse.executions = injectDomainIntoWorkflowList(
    params.domain,
    archivedWorkflowsResponse
  );

  ctx.body = archivedWorkflowsResponse;
};

module.exports = workflowArchivedListHandler;
