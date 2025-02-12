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
const grpc = require('@grpc/grpc-js');

describe('Query Workflow', function() {
  it('should list workflows using a temporary hack of parsing out the available workflows from a NotFoundError', async function() {
    this.timeout(50000);
    this.test.QueryWorkflow = ({ queryRequest }) => {
      queryRequest.query.queryType.should.equal('__cadence_web_list');
      const message =
        '__cadence_web_list not found. KnownQueryTypes=[foo bar ]';
      const error = {
        tchannel: {
          ok: false,
          body: {
            message,
          },
          typeName: 'badRequestError',
        },
        grpc: {
          code: grpc.status.INVALID_ARGUMENT,
          message,
        },
      };

      return error[process.env.TRANSPORT_CLIENT_TYPE];
    };

    return request(global.app)
      .get('/api/domains/canary/workflows/ci%2Fdemo/run1/query')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(['foo', 'bar']);
  });
  it('should forward the query to the workflow', async function() {
    this.test.QueryWorkflow = ({ queryRequest }) => {
      const expectedRequest = {
        tchannel: {
          domain: 'canary',
          execution: {
            workflowId: 'ci/demo',
            runId: 'run1',
          },
          query: {
            queryType: 'state',
            queryArgs: null,
          },
          queryConsistencyLevel: null,
          queryRejectCondition: null,
        },
        grpc: {
          domain: 'canary',
          workflowExecution: {
            workflowId: 'ci/demo',
            runId: 'run1',
          },
          query: {
            queryType: 'state',
            queryArgs: null,
          },
          queryConsistencyLevel: 'QUERY_CONSISTENCY_LEVEL_INVALID',
          queryRejectCondition: 'QUERY_REJECT_CONDITION_INVALID',
        },
      };

      queryRequest.should.deep.equal(
        expectedRequest[process.env.TRANSPORT_CLIENT_TYPE]
      );

      const response = {
        tchannel: {
          queryResult: Buffer.from('foobar'),
        },
        grpc: {
          queryResult: {
            data: btoa('foobar'),
          },
        },
      };

      return response[process.env.TRANSPORT_CLIENT_TYPE];
    };

    return request(global.app)
      .post('/api/domains/canary/workflows/ci%2Fdemo/run1/query/state')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        queryRejected: null,
        queryResult: 'foobar',
        queryResult_base64: Buffer.from('foobar').toString('base64'),
      });
  });
  it('should turn bad requests into 400s', async function() {
    const message = 'that does not make sense';
    const response = {
      tchannel: {
        ok: false,
        body: {
          message,
        },
        typeName: 'badRequestError',
      },
      grpc: {
        code: grpc.status.INVALID_ARGUMENT,
        message,
      },
    };

    this.test.QueryWorkflow = () => response[process.env.TRANSPORT_CLIENT_TYPE];

    return request(global.app)
      .post('/api/domains/canary/workflows/ci%2Fdemo/run1/query/state')
      .expect(400)
      .expect('Content-Type', /json/)
      .expect({
        message: 'that does not make sense',
      });
  });
});
