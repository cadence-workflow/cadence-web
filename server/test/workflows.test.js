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

describe('Listing Workflows', function() {
  const demoExecThrift = {
    execution: {
      workflowId: 'demo',
      runId: 'd92bb92c-5f49-487f-80a8-f8f375ba55a8',
    },
    type: {
      name: 'github.com/uber/cadence/demo.cronWorkflow',
    },
    startTime: dateToLong('2017-11-10T21:30:00.000Z'),
    closeTime: null,
    closeStatus: null,
    domainName: 'canary',
    historyLength: null,
    isCron: null,
    autoResetPoints: null,
    executionTime: null,
    memo: null,
    parentDomainId: null,
    parentDomainName: null,
    parentExecution: null,
    parentInitatedId: null,
    partitionConfig: null,
    searchAttributes: null,
    updateTime: null,
  };
  const demoExecGrpc = {
    workflowExecution: {
      workflowId: 'demo',
      runId: 'd92bb92c-5f49-487f-80a8-f8f375ba55a8',
    },
    type: {
      name: 'github.com/uber/cadence/demo.cronWorkflow',
    },
    startTime: dateToTimestamp('2017-11-10T21:30:00.000Z'),
    closeTime: null,
    closeStatus: null,
    domainName: 'canary',
    historyLength: null,
    isCron: null,
    autoResetPoints: null,
    executionTime: null,
    memo: null,
    parentDomainId: null,
    parentDomainName: null,
    parentExecution: null,
    parentInitatedId: null,
    partitionConfig: null,
    searchAttributes: null,
    updateTime: null,
  };
  const demoExecJson = Object.assign({}, demoExecThrift, {
    startTime: '2017-11-10T21:30:00.000Z',
    taskList: null,
  });
  const demoExec = {
    tchannel: demoExecThrift,
    grpc: demoExecGrpc,
    json: demoExecJson,
  };

  const clusterElasticSearchEnabled = {
    persistenceInfo: {
      visibilityStore: {
        features: [
          {
            key: 'advancedVisibilityEnabled',
            enabled: true,
          },
        ],
      },
    },
  };

  const clusterElasticSearchDisabled = {
    persistenceInfo: {
      visibilityStore: {
        features: [
          {
            key: 'advancedVisibilityEnabled',
            enabled: false,
          },
        ],
      },
    },
  };

  afterEach(() => {
    return request().delete('/api/cluster/cache');
  });

  it('should fail to list all workflows with ES disabled', function() {
    this.test.DescribeCluster = () => {
      return clusterElasticSearchDisabled;
    };

    return request()
      .get(
        '/api/domains/canary/workflows/all?startTime=2017-11-12T12:00:00Z&endTime=2017-11-13T14:30:00Z'
      )
      .expect(400)
      .expect('Content-Type', /json/)
      .expect({
        message:
          'Advanced visibility is not supported for cluster. Try using workflows open or closed APIs.',
      });
  });

  it('should list all workflows with ES enabled', function() {
    this.test.ListWorkflowExecutions = ({ listRequest }) => {
      listRequest.query
        .match('2017-11-12T12:00:00.000Z')[0]
        .should.equal('2017-11-12T12:00:00.000Z');

      listRequest.query
        .match('2017-11-13T14:30:00.000Z')[0]
        .should.equal('2017-11-13T14:30:00.000Z');

      return {
        executions: [demoExec[process.env.TRANSPORT_CLIENT_TYPE]],
        nextPageToken: new Buffer('{"IsWorkflowRunning":true,NextEventId:37}'),
      };
    };

    this.test.DescribeCluster = () => {
      return clusterElasticSearchEnabled;
    };

    return request()
      .get(
        '/api/domains/canary/workflows/all?startTime=2017-11-12T12:00:00Z&endTime=2017-11-13T14:30:00Z'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        executions: [demoExec.json],
        nextPageToken:
          'eyJJc1dvcmtmbG93UnVubmluZyI6dHJ1ZSxOZXh0RXZlbnRJZDozN30=',
      });
  });

  it('should list open workflows with ES disabled', function() {
    this.test.ListOpenWorkflowExecutions = ({ listRequest }) => {
      listRequest.domain.should.equal('canary');
      should.not.exist(listRequest.executionFilter);
      should.not.exist(listRequest.typeFilter);

      switch (process.env.TRANSPORT_CLIENT_TYPE) {
        case 'tchannel': {
          listRequest.StartTimeFilter.earliestTime
            .div(1000000000)
            .toNumber()
            .should.equal(1510488000);
          listRequest.StartTimeFilter.latestTime
            .div(1000000000)
            .toNumber()
            .should.equal(1510583400);
          break;
        }
        case 'grpc': {
          listRequest.startTimeFilter.earliestTime.seconds.should.equal(
            '1510488000'
          );
          listRequest.startTimeFilter.latestTime.seconds.should.equal(
            '1510583400'
          );
          break;
        }
        default:
          throw new Error(
            `unexpected transport type "${process.env.TRANSPORT_CLIENT_TYPE}"`
          );
      }

      return {
        executions: [demoExec[process.env.TRANSPORT_CLIENT_TYPE]],
        nextPageToken: new Buffer('{"IsWorkflowRunning":true,NextEventId:37}'),
      };
    };

    this.test.DescribeCluster = () => {
      return clusterElasticSearchDisabled;
    };

    return request()
      .get(
        '/api/domains/canary/workflows/open?startTime=2017-11-12T12:00:00Z&endTime=2017-11-13T14:30:00Z'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        executions: [demoExec.json],
        nextPageToken:
          'eyJJc1dvcmtmbG93UnVubmluZyI6dHJ1ZSxOZXh0RXZlbnRJZDozN30=',
      });
  });

  it('should list open workflows with ES enabled', function() {
    this.test.ListWorkflowExecutions = ({ listRequest }) => {
      listRequest.query
        .match('2017-11-12T12:00:00.000Z')[0]
        .should.equal('2017-11-12T12:00:00.000Z');

      listRequest.query
        .match('2017-11-13T14:30:00.000Z')[0]
        .should.equal('2017-11-13T14:30:00.000Z');

      return {
        executions: [demoExec[process.env.TRANSPORT_CLIENT_TYPE]],
        nextPageToken: new Buffer('{"IsWorkflowRunning":true,NextEventId:37}'),
      };
    };

    this.test.DescribeCluster = () => {
      return clusterElasticSearchEnabled;
    };

    return request()
      .get(
        '/api/domains/canary/workflows/open?startTime=2017-11-12T12:00:00Z&endTime=2017-11-13T14:30:00Z'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        executions: [demoExec.json],
        nextPageToken:
          'eyJJc1dvcmtmbG93UnVubmluZyI6dHJ1ZSxOZXh0RXZlbnRJZDozN30=',
      });
  });

  it('should list closed workflows with ES disabled', function() {
    this.test.ListClosedWorkflowExecutions = ({ listRequest }) => {
      listRequest.domain.should.equal('canary');
      should.not.exist(listRequest.executionFilter);
      should.not.exist(listRequest.typeFilter);

      switch (process.env.TRANSPORT_CLIENT_TYPE) {
        case 'tchannel': {
          listRequest.StartTimeFilter.earliestTime
            .div(1000000000)
            .toNumber()
            .should.equal(1510488000);
          listRequest.StartTimeFilter.latestTime
            .div(1000000000)
            .toNumber()
            .should.equal(1510583400);
          break;
        }
        case 'grpc': {
          listRequest.startTimeFilter.earliestTime.seconds.should.equal(
            '1510488000'
          );
          listRequest.startTimeFilter.latestTime.seconds.should.equal(
            '1510583400'
          );
          break;
        }
        default:
          throw new Error(
            `unexpected transport type "${process.env.TRANSPORT_CLIENT_TYPE}"`
          );
      }

      return {
        executions: [demoExec[process.env.TRANSPORT_CLIENT_TYPE]],
        nextPageToken: new Buffer('{"IsWorkflowRunning":false}'),
      };
    };

    this.test.DescribeCluster = () => {
      return clusterElasticSearchDisabled;
    };

    return request()
      .get(
        '/api/domains/canary/workflows/closed?startTime=2017-11-12T12:00:00Z&endTime=2017-11-13T14:30:00Z'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        executions: [demoExecJson],
        nextPageToken: 'eyJJc1dvcmtmbG93UnVubmluZyI6ZmFsc2V9',
      });
  });

  it('should list closed workflows with ES enabled', function() {
    this.test.ListWorkflowExecutions = ({ listRequest }) => {
      listRequest.domain.should.equal('canary');

      listRequest.query
        .match('2017-11-12T12:00:00.000Z')[0]
        .should.equal('2017-11-12T12:00:00.000Z');

      listRequest.query
        .match('2017-11-13T14:30:00.000Z')[0]
        .should.equal('2017-11-13T14:30:00.000Z');

      return {
        executions: [demoExec[process.env.TRANSPORT_CLIENT_TYPE]],
        nextPageToken: new Buffer('{"IsWorkflowRunning":false}'),
      };
    };

    this.test.DescribeCluster = () => {
      return clusterElasticSearchEnabled;
    };

    return request()
      .get(
        '/api/domains/canary/workflows/closed?startTime=2017-11-12T12:00:00Z&endTime=2017-11-13T14:30:00Z'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        executions: [demoExec.json],
        nextPageToken: 'eyJJc1dvcmtmbG93UnVubmluZyI6ZmFsc2V9',
      });
  });

  it('should forward the next page token along', function() {
    this.test.ListClosedWorkflowExecutions = ({ listRequest }) => {
      switch (process.env.TRANSPORT_CLIENT_TYPE) {
        case 'tchannel': {
          listRequest.nextPageToken.toString().should.equal('page1');
          break;
        }
        case 'grpc': {
          listRequest.nextPageToken.toString().should.equal('cGFnZTE=');
          break;
        }
        default:
          throw new Error(
            `unexpected transport type "${process.env.TRANSPORT_CLIENT_TYPE}"`
          );
      }

      return {
        executions: [],
        nextPageToken: new Buffer('page2'),
      };
    };

    this.test.DescribeCluster = () => {
      return clusterElasticSearchDisabled;
    };

    return request()
      .get(
        '/api/domains/canary/workflows/closed?startTime=2017-11-01&endTime=2017-11-13T22:27:17.551Z&nextPageToken=cGFnZTE='
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        executions: [],
        nextPageToken: 'cGFnZTI=',
      });
  });

  it('should return 404 if another state of workflows is queried', function() {
    return request()
      .get('/api/domains/canary/workflows/failed')
      .expect(404);
  });

  it('should return 400 if startTime or endTime are missing', async function() {
    await request()
      .get('/api/domains/canary/workflows/open?startTime=2017-11-01')
      .expect(400);

    return request()
      .get('/api/domains/canary/workflows/closed?endTime=2017-11-01')
      .expect(400);
  });
});
