// Copyright (c) 2017-2021 Uber Technologies Inc.
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

describe('Query Workflow', function() {
  it('should list workflows using a temporary hack of parsing out the available workflows from a NotFoundError', async function() {
    this.timeout(50000);
    this.test.QueryWorkflow = ({ queryRequest }) => {
      queryRequest.query.queryType.should.equal('__cadence_web_list');

      return {
        ok: false,
        body: {
          message: '__cadence_web_list not found. KnownQueryTypes=[foo bar ]',
        },
        typeName: 'badRequestError',
      };
    };

    return request(global.app)
      .get('/api/domains/canary/workflows/ci%2Fdemo/run1/query')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(['foo', 'bar']);
  });

  it('should forward the query to the workflow', async function() {
    this.test.QueryWorkflow = ({ queryRequest }) => {
      queryRequest.should.deep.equal({
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
      });

      return { queryResult: Buffer.from('foobar') };
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
    this.test.QueryWorkflow = () => ({
      ok: false,
      body: { message: 'that does not make sense' },
      typeName: 'badRequestError',
    });

    return request(global.app)
      .post('/api/domains/canary/workflows/ci%2Fdemo/run1/query/state')
      .expect(400)
      .expect('Content-Type', /json/)
      .expect({
        message: 'that does not make sense',
      });
  });
});
