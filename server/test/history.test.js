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

const btoa = require('btoa');
const Long = require('long');

const wfHistoryThrift = [
  {
    eventId: 1,
    timestamp: new Long(800610625, 351737684, false),
    eventType: 'WorkflowExecutionStarted',
    workflowExecutionStartedEventAttributes: {
      attempt: null,
      workflowType: {
        name: 'github.com/uber/cadence/demo',
      },
      taskList: {
        name: 'ci-task-queue',
        kind: null,
      },
      identity: null,
      input: Buffer.from(
        JSON.stringify({
          emails: ['jane@example.com', 'bob@example.com'],
          includeFooter: true,
        })
      ),
      expirationTimestamp: null,
      continuedExecutionRunId: null,
      continuedFailureDetails: null,
      continuedFailureReason: null,
      cronSchedule: null,
      firstDecisionTaskBackoffSeconds: null,
      firstExecutionRunId: null,
      firstScheduledTimeNano: null,
      header: null,
      initiator: null,
      lastCompletionResult: null,
      memo: null,
      originalExecutionRunId: null,
      parentInitiatedEventId: null,
      parentWorkflowDomain: null,
      parentWorkflowExecution: null,
      partitionConfig: null,
      prevAutoResetPoints: null,
      requestId: null,
      retryPolicy: null,
      searchAttributes: null,
      taskStartToCloseTimeoutSeconds: 30,
      executionStartToCloseTimeoutSeconds: 1080,
    },
  },
  {
    eventId: 2,
    timestamp: new Long(800610625, 351737684, false),
    eventType: 'DecisionTaskScheduled',
    decisionTaskScheduledEventAttributes: {
      startToCloseTimeoutSeconds: 180,
      attempt: 1,
      taskList: {
        name: 'canary-task-queue',
        kind: null,
      },
    },
  },
  {
    eventId: 3,
    timestamp: new Long(800610625, 351737688, false),
    eventType: 'DecisionTaskStarted',
    decisionTaskStartedEventAttributes: {
      identity: 'box1@ci-task-queue',
      requestId: 'fafa095d-b4ca-423a-a812-223e62b5ccf8',
      scheduledEventId: 2,
    },
  },
];
const wfHistoryGrpc = [
  {
    eventId: 1,
    eventTime: { seconds: '1510701850', nanos: '351393089' },
    eventType: 'WorkflowExecutionStarted',
    workflowExecutionStartedEventAttributes: {
      attempt: null,
      workflowType: {
        name: 'github.com/uber/cadence/demo',
      },
      taskList: {
        name: 'ci-task-queue',
        kind: null,
      },
      identity: null,
      input: {
        data: btoa(
          JSON.stringify({
            emails: ['jane@example.com', 'bob@example.com'],
            includeFooter: true,
          })
        ),
      },
      expirationTimestamp: null,
      continuedExecutionRunId: null,
      continuedFailure: {
        details: null,
        reason: null,
      },
      cronSchedule: null,
      firstDecisionTaskBackoff: null,
      firstExecutionRunId: null,
      firstScheduledTimeNano: null,
      header: null,
      initiator: null,
      lastCompletionResult: null,
      memo: null,
      originalExecutionRunId: null,
      parentInitiatedEventId: null,
      parentWorkflowDomain: null,
      parentWorkflowExecution: null,
      partitionConfig: null,
      prevAutoResetPoints: null,
      requestId: null,
      retryPolicy: null,
      searchAttributes: null,
      taskStartToCloseTimeout: { seconds: 30 },
      executionStartToCloseTimeout: { seconds: 1080 },
    },
  },
  {
    eventId: 2,
    eventTime: { seconds: '1510701850', nanos: '351393089' },
    eventType: 'DecisionTaskScheduled',
    decisionTaskScheduledEventAttributes: {
      startToCloseTimeout: { seconds: 180 },
      attempt: 1,
      taskList: {
        name: 'canary-task-queue',
        kind: null,
      },
    },
  },
  {
    eventId: 3,
    eventTime: { seconds: '1510701867', nanos: '531262273' },
    eventType: 'DecisionTaskStarted',
    decisionTaskStartedEventAttributes: {
      identity: 'box1@ci-task-queue',
      requestId: 'fafa095d-b4ca-423a-a812-223e62b5ccf8',
      scheduledEventId: 2,
    },
  },
];
const wfHistoryJson = [
  {
    eventId: 1,
    timestamp: '2017-11-14T23:24:10.351Z',
    eventType: 'WorkflowExecutionStarted',
    details: Object.assign(
      {},
      wfHistoryThrift[0].workflowExecutionStartedEventAttributes,
      {
        input: [
          {
            emails: ['jane@example.com', 'bob@example.com'],
            includeFooter: true,
          },
        ],
      }
    ),
  },
  {
    eventId: 2,
    timestamp: '2017-11-14T23:24:10.351Z',
    eventType: 'DecisionTaskScheduled',
    details: wfHistoryThrift[1].decisionTaskScheduledEventAttributes,
  },
  {
    eventId: 3,
    timestamp: '2017-11-14T23:24:27.531Z',
    eventType: 'DecisionTaskStarted',
    details: {
      identity: 'box1@ci-task-queue',
      requestId: 'fafa095d-b4ca-423a-a812-223e62b5ccf8',
      scheduledEventId: 2,
    },
  },
];

describe('Workflow History', function() {
  it('should forward the request to the cadence frontend with workflowId and runId', function() {
    this.test.GetWorkflowExecutionHistory = ({ getRequest }) => {
      const request = {
        tchannel: {
          HistoryEventFilterType: null,
          domain: 'canary',
          execution: {
            workflowId: 'ci/demo',
            runId: 'run1',
          },
          maximumPageSize: 100,
          nextPageToken: null,
          skipArchival: null,
          waitForNewEvent: null,
        },
        grpc: {
          domain: 'canary',
          workflowExecution: {
            workflowId: 'ci/demo',
            runId: 'run1',
          },
          pageSize: 1000,
          nextPageToken: null,
          waitForNewEvent: null,
          historyEventFilterType: 'EVENT_FILTER_TYPE_INVALID',
          skipArchival: null,
        },
      };

      getRequest.should.deep.equal(request[process.env.TRANSPORT_CLIENT_TYPE]);

      return {
        history: { events: wfHistoryThrift },
        nextPageToken: new Buffer('page2'),
      };
    };

    return request()
      .get('/api/domains/canary/workflows/ci%2Fdemo/run1/history')
      .expect(200)
      .expect('Content-Type', /json/);
  });
  it('should forward the nextPageToken', function() {
    this.test.GetWorkflowExecutionHistory = ({ getRequest }) => {
      const requestNextPageToken = {
        tchannel: 'page2',
        grpc: 'cGFnZTI=',
      };

      getRequest.nextPageToken
        .toString()
        .should.equal(requestNextPageToken[process.env.TRANSPORT_CLIENT_TYPE]);

      return {
        history: { events: [] },
        nextPageToken: new Buffer('page3'),
      };
    };

    return request()
      .get(
        '/api/domains/canary/workflows/ci%2Fdemo/run1/history?nextPageToken=cGFnZTI%3D'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        archived: null,
        history: { events: [] },
        nextPageToken: 'cGFnZTM=',
        rawHistory: null,
      });
  });
  it('should support long polling by forwarding the waitForNewEvent flag', function() {
    this.test.GetWorkflowExecutionHistory = ({ getRequest }) => {
      getRequest.waitForNewEvent.should.be.true;

      return { history: { events: [{ eventId: 1 }] } };
    };

    return request()
      .get(
        '/api/domains/canary/workflows/ci%2Fdemo/run1/history?waitForNewEvent=true'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .then(() =>
        request()
          .get(
            '/api/domains/canary/workflows/ci%2Fdemo/run1/history?waitForNewEvent'
          )
          .expect(200)
      );
  });
  it('should transform Long numbers to JavaScript numbers, Long dates to ISO date strings, and line-delimited JSON buffers to JSON', function() {
    const events = {
      tchannel: wfHistoryThrift,
      grpc: wfHistoryGrpc,
    };

    this.test.GetWorkflowExecutionHistory = ({ getRequest }) => ({
      history: { events: events[process.env.TRANSPORT_CLIENT_TYPE] },
      nextPageToken: new Buffer('page2'),
    });

    return request()
      .get('/api/domains/canary/workflows/ci%2Fdemo/run1/history')
      .expect(200)
      .expect({
        archived: null,
        history: { events: wfHistoryJson },
        nextPageToken: 'cGFnZTI=',
        rawHistory: null,
      });
  });
  describe('Export', function() {
    const wfHistoryCliJson = `[{"eventId":1,"timestamp":1510701850351393089,"eventType":"WorkflowExecutionStarted","workflowExecutionStartedEventAttributes":{"workflowType":{"name":"github.com/uber/cadence/demo"},"taskList":{"name":"ci-task-queue"},"input":"eyJlbWFpbHMiOlsiamFuZUBleGFtcGxlLmNvbSIsImJvYkBleGFtcGxlLmNvbSJdLCJpbmNsdWRlRm9vdGVyIjp0cnVlfQ==","executionStartToCloseTimeoutSeconds":1080,"taskStartToCloseTimeoutSeconds":30}},{"eventId":2,"timestamp":1510701850351393089,"eventType":"DecisionTaskScheduled","decisionTaskScheduledEventAttributes":{"taskList":{"name":"canary-task-queue"},"startToCloseTimeoutSeconds":180,"attempt":1}},{"eventId":3,"timestamp":1510701867531262273,"eventType":"DecisionTaskStarted","decisionTaskStartedEventAttributes":{"scheduledEventId":2,"identity":"box1@ci-task-queue","requestId":"fafa095d-b4ca-423a-a812-223e62b5ccf8"}}]`;

    it('should be able to export history in a format compatible with the CLI', function() {
      const events = {
        tchannel: wfHistoryThrift,
        grpc: wfHistoryGrpc,
      };

      this.test.GetWorkflowExecutionHistory = ({ getRequest }) => ({
        history: { events: events[process.env.TRANSPORT_CLIENT_TYPE] },
      });

      return request()
        .get('/api/domains/canary/workflows/ci%2Fdemo/run1/export')
        .expect(200)
        .expect(wfHistoryCliJson);
    });
    it('should page through all responses', async function() {
      let calls = 0;
      const events = {
        tchannel: wfHistoryThrift,
        grpc: wfHistoryGrpc,
      };

      this.test.GetWorkflowExecutionHistory = ({ getRequest }) => {
        if (calls > 0) {
          getRequest.nextPageToken.should.be.ok;
        } else {
          should.not.exist(getRequest.nextPageToken);
        }

        const resp = {
          history: {
            events: [events[process.env.TRANSPORT_CLIENT_TYPE][calls]],
          },
        };

        if (++calls < events[process.env.TRANSPORT_CLIENT_TYPE].length) {
          resp.nextPageToken = new Buffer('page' + calls);
        }

        return resp;
      };

      return request()
        .get('/api/domains/canary/workflows/ci%2Fdemo/run1/export')
        .expect(200)
        .expect(wfHistoryCliJson);
    });
  });
});
