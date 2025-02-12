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

describe('Workflow Execution', function() {
  it('should describe the workflow', async function() {
    this.test.DescribeWorkflowExecution = ({ describeRequest }) => {
      const response = {
        tchannel: {
          executionConfiguration: {
            taskList: { name: 'ci-task-list' },
            taskStartToCloseTimeoutSeconds: 10,
          },
        },
        grpc: {
          executionConfiguration: {
            taskList: { name: 'ci-task-list' },
            taskStartToCloseTimeout: { seconds: 10 },
          },
        },
      };

      return response[process.env.TRANSPORT_CLIENT_TYPE];
    };

    return request()
      .get('/api/domains/canary/workflows/ci%2Fdemo/run1')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        executionConfiguration: {
          taskList: {
            name: 'ci-task-list',
            kind: null,
          },
          taskStartToCloseTimeoutSeconds: 10,
          executionStartToCloseTimeoutSeconds: null,
        },
        workflowExecutionInfo: null,
        pendingChildren: null,
        pendingActivities: null,
        pendingDecision: null,
      });
  });
  it('should terminate a workflow', async function() {
    let reason;

    this.test.TerminateWorkflowExecution = ({ terminateRequest }) => {
      terminateRequest.workflowExecution.workflowId.should.equal('ci/demo');
      terminateRequest.workflowExecution.runId.should.equal('run1');
      reason = terminateRequest.reason;

      return {};
    };

    return request()
      .post('/api/domains/canary/workflows/ci%2Fdemo/run1/terminate')
      .send({ reason: 'example reason' })
      .expect(204)
      .expect(() => reason.should.equal('example reason'));
  });
  it('should signal a workflow without input', async function() {
    let signal;

    this.test.SignalWorkflowExecution = ({ signalRequest }) => {
      signalRequest.workflowExecution.workflowId.should.equal('ci/demo');
      signalRequest.workflowExecution.runId.should.equal('run2');
      signal = signalRequest.signalName;

      return {};
    };

    return request()
      .post('/api/domains/canary/workflows/ci%2Fdemo/run2/signal/firealarm')
      .expect(204)
      .expect(() => signal.should.equal('firealarm'));
  });
});
