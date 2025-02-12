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

'use strict';

const TChannel = require('tchannel');

const { combine } = require('../../helpers');

const {
  cliTransform,
  makeChannels,
  makeRequest,
  withDomainPaging,
  withNextPageTokenBodyTransform,
  withWorkflowExecution,
  withVerboseWorkflowExecution,
} = require('./helpers');

const tchannelClient = ({ peers, requestConfig }) =>
  async function(ctx, next) {
    const { authTokenHeaders = {} } = ctx;

    const client = TChannel();
    const channels = await makeChannels({ client, peers });
    const request = makeRequest({
      authTokenHeaders,
      channels,
      ctx,
      requestConfig,
    });

    ctx.cadence = {
      archivedWorkflows: request({
        method: 'ListArchivedWorkflowExecutions',
        requestName: 'list',
        bodyTransform: combine(
          withDomainPaging(ctx),
          withNextPageTokenBodyTransform
        ),
      }),
      closedWorkflows: request({
        method: 'ListClosedWorkflowExecutions',
        requestName: 'list',
        bodyTransform: combine(
          withDomainPaging(ctx),
          withNextPageTokenBodyTransform
        ),
      }),
      describeCluster: request({
        channelName: 'admin',
        method: 'DescribeCluster',
        requestName: 'describe',
        serviceName: 'AdminService',
      }),
      describeDomain: request({
        method: 'DescribeDomain',
        requestName: 'describe',
      }),
      describeTaskList: request({
        method: 'DescribeTaskList',
      }),
      describeWorkflow: request({
        method: 'DescribeWorkflowExecution',
        requestName: 'describe',
        bodyTransform: withWorkflowExecution(ctx),
      }),
      exportHistory: request({
        method: 'GetWorkflowExecutionHistory',
        requestName: 'get',
        bodyTransform: combine(
          withDomainPaging(ctx),
          withWorkflowExecution(ctx),
          withNextPageTokenBodyTransform
        ),
        responseTransform: cliTransform,
      }),
      getHistory: request({
        method: 'GetWorkflowExecutionHistory',
        requestName: 'get',
        bodyTransform: combine(
          withDomainPaging(ctx),
          withWorkflowExecution(ctx),
          withNextPageTokenBodyTransform
        ),
      }),
      listDomains: request({
        method: 'ListDomains',
        requestName: 'list',
      }),
      listTaskListPartitions: request({
        method: 'ListTaskListPartitions',
      }),
      listWorkflows: request({
        method: 'ListWorkflowExecutions',
        requestName: 'list',
        bodyTransform: combine(
          withDomainPaging(ctx),
          withNextPageTokenBodyTransform
        ),
      }),
      openWorkflows: request({
        method: 'ListOpenWorkflowExecutions',
        requestName: 'list',
        bodyTransform: combine(
          withDomainPaging(ctx),
          withNextPageTokenBodyTransform
        ),
      }),
      queryWorkflow: request({
        method: 'QueryWorkflow',
        requestName: 'query',
        bodyTransform: withWorkflowExecution(ctx),
      }),
      signalWorkflow: request({
        method: 'SignalWorkflowExecution',
        requestName: 'signal',
        bodyTransform: withVerboseWorkflowExecution(ctx),
      }),
      startWorkflow: request({
        method: 'StartWorkflowExecution',
        requestName: 'start',
      }),
      terminateWorkflow: request({
        method: 'TerminateWorkflowExecution',
        requestName: 'terminate',
        bodyTransform: withVerboseWorkflowExecution(ctx),
      }),
    };

    try {
      await next();
      client.close();
    } catch (e) {
      client.close();
      throw e;
    }
  };

module.exports = tchannelClient;
