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

import mapDomainDescription from './map-domain-description';

describe('mapDomainDescription', () => {
  describe('When domain is empty', () => {
    let domain;

    beforeEach(() => {
      domain = undefined;
    });

    it('should return "Emit Metrics" = "No".', () => {
      const output = mapDomainDescription(domain);

      expect(output['Emit Metrics']).toEqual('No');
    });

    it('should return "Global?" = "No".', () => {
      const output = mapDomainDescription(domain);

      expect(output['Global?']).toEqual('No');
    });

    it('should return "History Archival" = "Disabled".', () => {
      const output = mapDomainDescription(domain);

      expect(output['History Archival']).toEqual('Disabled');
    });

    it('should return "Retention Period" = "Unknown".', () => {
      const output = mapDomainDescription(domain);

      expect(output['Retention Period']).toEqual('Unknown');
    });

    it('should return "Visibility Archival" = "Disabled".', () => {
      const output = mapDomainDescription(domain);

      expect(output['History Archival']).toEqual('Disabled');
    });

    it('should return "clusters" = "Unknown".', () => {
      const output = mapDomainDescription(domain);

      expect(output.clusters).toEqual('Unknown');
    });

    it('should return "description" = "No description available".', () => {
      const output = mapDomainDescription(domain);

      expect(output.description).toEqual('No description available');
    });

    it('should return "owner" = "Unknown".', () => {
      const output = mapDomainDescription(domain);

      expect(output.owner).toEqual('Unknown');
    });
  });

  describe('When domain.domainInfo.description = "DomainDescription"', () => {
    it('should return "description" = "DomainDescription".', () => {
      const domain = {
        domainInfo: {
          description: 'DomainDescription',
        },
      };

      const output = mapDomainDescription(domain);

      expect(output.description).toEqual('DomainDescription');
    });
  });

  describe('When domain.domainInfo.ownerEmail = "OwnerEmail"', () => {
    it('should return "owner" = "OwnerEmail".', () => {
      const domain = {
        domainInfo: {
          ownerEmail: 'OwnerEmail',
        },
      };

      const output = mapDomainDescription(domain);

      expect(output.owner).toEqual('OwnerEmail');
    });
  });

  describe('When domain.isGlobalDomain = true', () => {
    it('should return "Global?" = "Yes".', () => {
      const domain = {
        isGlobalDomain: true,
      };

      const output = mapDomainDescription(domain);

      expect(output['Global?']).toEqual('Yes');
    });
  });

  describe('When domain.configuration.workflowExecutionRetentionPeriodInDays = 3', () => {
    it('should return "Retention Period" = "3 days".', () => {
      const domain = {
        configuration: {
          workflowExecutionRetentionPeriodInDays: 3,
        },
      };

      const output = mapDomainDescription(domain);

      expect(output['Retention Period']).toEqual('3 days');
    });
  });

  describe('When domain.configuration.emitMetric = true', () => {
    it('should return "Emit Metrics" = "Yes".', () => {
      const domain = {
        configuration: {
          emitMetric: true,
        },
      };

      const output = mapDomainDescription(domain);

      expect(output['Emit Metrics']).toEqual('Yes');
    });
  });

  describe('When domain.configuration.historyArchivalStatus = "ENABLED"', () => {
    it('should return "History Archival" = "Enabled".', () => {
      const domain = {
        configuration: {
          historyArchivalStatus: 'ENABLED',
        },
      };

      const output = mapDomainDescription(domain);

      expect(output['History Archival']).toEqual('Enabled');
    });
  });

  describe('When domain.configuration.visibilityArchivalStatus = "ENABLED"', () => {
    it('should return "Visibility Archival" = "Enabled".', () => {
      const domain = {
        configuration: {
          visibilityArchivalStatus: 'ENABLED',
        },
      };

      const output = mapDomainDescription(domain);

      expect(output['Visibility Archival']).toEqual('Enabled');
    });
  });

  describe('When domain.failoverVersion = 1', () => {
    it('should return "Failover Version" = 1', () => {
      const domain = {
        failoverVersion: 1,
      };

      const output = mapDomainDescription(domain);

      expect(output['Failover Version']).toEqual(1);
    });
  });

  describe(`Multiple clusters with one active cluster`, () => {
    it('should return "clusters" = "cluster1 (active), cluster2".', () => {
      const domain = {
        replicationConfiguration: {
          activeClusterName: 'cluster1',
          clusters: [{ clusterName: 'cluster1' }, { clusterName: 'cluster2' }],
        },
      };

      const output = mapDomainDescription(domain);

      expect(output.clusters).toEqual('cluster1 (active), cluster2');
    });
  });
});
