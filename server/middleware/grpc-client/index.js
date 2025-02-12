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

const { combine } = require('../../helpers');
const {
  adminServiceConfig,
  domainServiceConfig,
  visibilityServiceConfig,
  workflowServiceConfig,
} = require('./configuration');
const {
  formatRequestDescribeTaskList,
  formatRequestGetHistory,
  formatRequestWorkflowList,
} = require('./format-request');
const {
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
} = require('./format-response');
const GRPCService = require('./grpc-service');
const {
  withDomain,
  withPagination,
  withWorkflowExecution,
} = require('./transform');

const grpcClient = ({ peers, requestConfig }) =>
  async function(ctx, next) {
    const adminService = new GRPCService({
      ctx,
      peers,
      requestConfig,
      ...adminServiceConfig,
    });
    const domainService = new GRPCService({
      ctx,
      peers,
      requestConfig,
      ...domainServiceConfig,
    });
    const visibilityService = new GRPCService({
      ctx,
      peers,
      requestConfig,
      ...visibilityServiceConfig,
    });
    const workflowService = new GRPCService({
      ctx,
      peers,
      requestConfig,
      ...workflowServiceConfig,
    });

    ctx.cadence = {
      archivedWorkflows: visibilityService.request({
        formatResponse: formatResponseWorkflowList,
        method: 'ListArchivedWorkflowExecutions',
        transform: combine(withDomain(ctx), withPagination(ctx)),
      }),
      closedWorkflows: visibilityService.request({
        formatRequest: formatRequestWorkflowList,
        formatResponse: formatResponseWorkflowList,
        method: 'ListClosedWorkflowExecutions',
        transform: combine(withDomain(ctx), withPagination(ctx)),
      }),
      describeCluster: adminService.request({
        method: 'DescribeCluster',
      }),
      describeDomain: domainService.request({
        formatResponse: formatResponseDomain,
        method: 'DescribeDomain',
      }),
      describeTaskList: workflowService.request({
        formatRequest: formatRequestDescribeTaskList,
        formatResponse: formatResponseDescribeTaskList,
        method: 'DescribeTaskList',
      }),
      describeWorkflow: workflowService.request({
        formatResponse: formatResponseDescribeWorkflow,
        method: 'DescribeWorkflowExecution',
        transform: combine(withDomain(ctx), withWorkflowExecution(ctx)),
      }),
      exportHistory: workflowService.request({
        formatRequest: formatRequestGetHistory,
        formatResponse: formatResponseExportHistory,
        method: 'GetWorkflowExecutionHistory',
        transform: combine(
          withDomain(ctx),
          withPagination(ctx),
          withWorkflowExecution(ctx)
        ),
      }),
      getHistory: workflowService.request({
        formatRequest: formatRequestGetHistory,
        formatResponse: formatResponseGetHistory,
        method: 'GetWorkflowExecutionHistory',
        transform: combine(
          withDomain(ctx),
          withPagination(ctx),
          withWorkflowExecution(ctx)
        ),
      }),
      listDomains: domainService.request({
        formatResponse: formatResponseListDomains,
        method: 'ListDomains',
      }),
      listTaskListPartitions: workflowService.request({
        method: 'ListTaskListPartitions',
      }),
      listWorkflows: visibilityService.request({
        formatResponse: formatResponseWorkflowList,
        method: 'ListWorkflowExecutions',
        transform: combine(withDomain(ctx), withPagination(ctx)),
      }),
      openWorkflows: visibilityService.request({
        formatRequest: formatRequestWorkflowList,
        formatResponse: formatResponseWorkflowList,
        method: 'ListOpenWorkflowExecutions',
        transform: combine(withDomain(ctx), withPagination(ctx)),
      }),
      queryWorkflow: workflowService.request({
        method: 'QueryWorkflow',
        formatResponse: formatResponseQueryWorkflow,
        transform: combine(withDomain(ctx), withWorkflowExecution(ctx)),
      }),
      signalWorkflow: workflowService.request({
        formatResponse: formatResponseSignalWorkflowExecution,
        method: 'SignalWorkflowExecution',
        transform: combine(withDomain(ctx), withWorkflowExecution(ctx)),
      }),
      terminateWorkflow: workflowService.request({
        formatResponse: formatResponseTerminateWorkflowExecution,
        method: 'TerminateWorkflowExecution',
        transform: combine(withDomain(ctx), withWorkflowExecution(ctx)),
      }),
    };

    try {
      await next();
      domainService.close();
      visibilityService.close();
      workflowService.close();
    } catch (e) {
      domainService.close();
      visibilityService.close();
      workflowService.close();
      throw e;
    }
  };

module.exports = grpcClient;
