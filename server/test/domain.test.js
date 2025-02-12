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

const grpc = require('@grpc/grpc-js');

describe('Describe Domain', function() {
  it('should list domains', async function() {
    const domains = {
      tchannel: [
        {
          domainInfo: {
            name: 'ci-test-domain',
            status: 'REGISTERED',
            description: 'domain for running CI tests',
            ownerEmail: 'cadence-dev@uber.com',
            data: {},
            uuid: null,
          },
          isGlobalDomain: false,
          failoverInfo: null,
          failoverVersion: 0,
          configuration: {
            AsyncWorkflowConfiguration: null,
            badBinaries: null,
            emitMetric: true,
            historyArchivalStatus: null,
            historyArchivalURI: null,
            isolationgroups: null,
            visibilityArchivalStatus: null,
            visibilityArchivalURI: null,
            workflowExecutionRetentionPeriodInDays: 14,
          },
          replicationConfiguration: {
            activeClusterName: 'ci-cluster',
            clusters: [{ clusterName: 'ci-cluster' }],
          },
        },
      ],
      grpc: [
        {
          id: '',
          name: 'ci-test-domain',
          status: 'DOMAIN_STATUS_REGISTERED',
          description: 'domain for running CI tests',
          ownerEmail: 'cadence-dev@uber.com',
          data: {},
          workflowExecutionRetentionPeriod: { seconds: '1209600', nanos: '0' },
          badBinaries: null,
          historyArchivalStatus: 'ARCHIVAL_STATUS_INVALID',
          historyArchivalUri: '',
          visibilityArchivalStatus: 'ARCHIVAL_STATUS_INVALID',
          visibilityArchivalUri: '',
          activeClusterName: 'ci-cluster',
          clusters: [{ clusterName: 'ci-cluster' }],
          failoverVersion: '0',
          isGlobalDomain: false,
          failoverInfo: null,
        },
      ],
    };

    this.test.ListDomains = ({ listRequest }) => {
      should.not.exist(listRequest.nextPageToken);

      return { domains: domains[process.env.TRANSPORT_CLIENT_TYPE] };
    };

    return request()
      .get('/api/domains')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(domains.tchannel);
  });

  it('should describe the domain', async function() {
    const domainDesc = {
      tchannel: {
        domainInfo: {
          name: 'test-domain',
          status: 'REGISTERED',
          description: 'ci test domain',
          ownerEmail: null,
          data: {},
          uuid: null,
        },
        failoverInfo: null,
        failoverVersion: 0,
        isGlobalDomain: true,
        configuration: {
          AsyncWorkflowConfiguration: null,
          badBinaries: null,
          workflowExecutionRetentionPeriodInDays: 14,
          emitMetric: true,
          historyArchivalStatus: null,
          historyArchivalURI: null,
          isolationgroups: null,
          visibilityArchivalStatus: null,
          visibilityArchivalURI: null,
        },
        replicationConfiguration: {
          activeClusterName: 'ci-cluster',
          clusters: [],
        },
      },
      grpc: {
        domain: {
          id: '',
          name: 'test-domain',
          status: 'DOMAIN_STATUS_REGISTERED',
          description: 'ci test domain',
          ownerEmail: '',
          data: {},
          workflowExecutionRetentionPeriod: { seconds: '1209600', nanos: '0' },
          badBinaries: null,
          historyArchivalStatus: 'ARCHIVAL_STATUS_INVALID',
          historyArchivalUri: '',
          visibilityArchivalStatus: 'ARCHIVAL_STATUS_INVALID',
          visibilityArchivalUri: '',
          activeClusterName: 'ci-cluster',
          clusters: [],
          failoverVersion: '0',
          isGlobalDomain: true,
          failoverInfo: null,
        },
      },
    };

    this.test.DescribeDomain = ({ describeRequest }) => {
      describeRequest.name.should.equal('test-domain');

      return domainDesc[process.env.TRANSPORT_CLIENT_TYPE];
    };

    return request()
      .get('/api/domains/test-domain')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(domainDesc.tchannel);
  });

  it('should return 404 if the domain is not found', async function() {
    const errorHandler = ({ describeRequest }) => {
      const message = `domain "${describeRequest.name}" does not exist`;
      const error = {
        tchannel: {
          ok: false,
          body: {
            message,
          },
          typeName: 'entityNotExistError',
        },
        grpc: {
          code: grpc.status.NOT_FOUND,
          message,
        },
      };

      return error[process.env.TRANSPORT_CLIENT_TYPE];
    };

    this.test.DescribeDomain = errorHandler;

    return request()
      .get('/api/domains/nonexistant')
      .expect(404)
      .expect('Content-Type', /json/)
      .expect({
        message: 'domain "nonexistant" does not exist',
      });
  });
});
