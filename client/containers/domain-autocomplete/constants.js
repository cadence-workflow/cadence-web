// Copyright (c) 2021 Uber Technologies Inc.
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

export const DOMAIN_AUTOCOMPLETE_STATE_PREFIX = 'domainAutocomplete';
export const DOMAIN_AUTOCOMPLETE_TYPE_PREFIX = 'DOMAIN_AUTOCOMPLETE';
export const RECENT_RESULT_LIMIT = 10;
export const TOP_RESULT_COUNT = 10;

// TODO - replace with API call...
export const DATA = [
  {
    domainInfo: {
      name: 'cadence-canary-local-1',
      status: 'REGISTERED',
      description: 'Local domain for cadence canaries',
      ownerEmail: '',
      data: {},
      uuid: '1',
    },
    configuration: {
      workflowExecutionRetentionPeriodInDays: 1,
      emitMetric: true,
      badBinaries: { binaries: {} },
      historyArchivalStatus: 'DISABLED',
      historyArchivalURI: '',
      visibilityArchivalStatus: 'DISABLED',
      visibilityArchivalURI: '',
    },
    replicationConfiguration: {
      activeClusterName: 'staging_dca',
      clusters: [{ clusterName: 'staging_dca' }],
    },
    failoverVersion: -24,
    isGlobalDomain: false,
  },
  {
    domainInfo: {
      name: 'cadence-canary-global-2',
      status: 'REGISTERED',
      description: 'Global domain for cadence canaries',
      ownerEmail: '',
      data: {},
      uuid: '2',
    },
    configuration: {
      workflowExecutionRetentionPeriodInDays: 1,
      emitMetric: true,
      badBinaries: { binaries: {} },
      historyArchivalStatus: 'DISABLED',
      historyArchivalURI: '',
      visibilityArchivalStatus: 'DISABLED',
      visibilityArchivalURI: '',
    },
    replicationConfiguration: {
      activeClusterName: 'staging_dca',
      clusters: [
        { clusterName: 'staging_dca' },
        { clusterName: 'staging_phx' },
      ],
    },
    failoverVersion: -24,
    isGlobalDomain: true,
  },
  {
    domainInfo: {
      name: 'cadence-canary-local-3',
      status: 'REGISTERED',
      description: 'Local domain for cadence canaries',
      ownerEmail: '',
      data: {},
      uuid: '3',
    },
    configuration: {
      workflowExecutionRetentionPeriodInDays: 1,
      emitMetric: true,
      badBinaries: { binaries: {} },
      historyArchivalStatus: 'DISABLED',
      historyArchivalURI: '',
      visibilityArchivalStatus: 'DISABLED',
      visibilityArchivalURI: '',
    },
    replicationConfiguration: {
      activeClusterName: 'staging_dca',
      clusters: [{ clusterName: 'staging_dca' }],
    },
    failoverVersion: -24,
    isGlobalDomain: false,
  },
  {
    domainInfo: {
      name: 'cadence-canary-global-4',
      status: 'REGISTERED',
      description: 'Global domain for cadence canaries',
      ownerEmail: '',
      data: {},
      uuid: '4',
    },
    configuration: {
      workflowExecutionRetentionPeriodInDays: 1,
      emitMetric: true,
      badBinaries: { binaries: {} },
      historyArchivalStatus: 'DISABLED',
      historyArchivalURI: '',
      visibilityArchivalStatus: 'DISABLED',
      visibilityArchivalURI: '',
    },
    replicationConfiguration: {
      activeClusterName: 'staging_dca',
      clusters: [
        { clusterName: 'staging_dca' },
        { clusterName: 'staging_phx' },
      ],
    },
    failoverVersion: -24,
    isGlobalDomain: true,
  },
];

export const RECENT_DATA = [
  {
    domainInfo: {
      name: 'recent-cadence-canary-local-1',
      status: 'REGISTERED',
      description: 'Local domain for cadence canaries',
      ownerEmail: '',
      data: {},
      uuid: '1',
    },
    configuration: {
      workflowExecutionRetentionPeriodInDays: 1,
      emitMetric: true,
      badBinaries: { binaries: {} },
      historyArchivalStatus: 'DISABLED',
      historyArchivalURI: '',
      visibilityArchivalStatus: 'DISABLED',
      visibilityArchivalURI: '',
    },
    replicationConfiguration: {
      activeClusterName: 'staging_dca',
      clusters: [{ clusterName: 'staging_dca' }],
    },
    failoverVersion: -24,
    isGlobalDomain: false,
  },
  {
    domainInfo: {
      name: 'recent-cadence-canary-global-2',
      status: 'REGISTERED',
      description: 'Global domain for cadence canaries',
      ownerEmail: '',
      data: {},
      uuid: '2',
    },
    configuration: {
      workflowExecutionRetentionPeriodInDays: 1,
      emitMetric: true,
      badBinaries: { binaries: {} },
      historyArchivalStatus: 'DISABLED',
      historyArchivalURI: '',
      visibilityArchivalStatus: 'DISABLED',
      visibilityArchivalURI: '',
    },
    replicationConfiguration: {
      activeClusterName: 'staging_dca',
      clusters: [
        { clusterName: 'staging_dca' },
        { clusterName: 'staging_phx' },
      ],
    },
    failoverVersion: -24,
    isGlobalDomain: true,
  },
  {
    domainInfo: {
      name: 'recent-cadence-canary-local-3',
      status: 'REGISTERED',
      description: 'Local domain for cadence canaries',
      ownerEmail: '',
      data: {},
      uuid: '3',
    },
    configuration: {
      workflowExecutionRetentionPeriodInDays: 1,
      emitMetric: true,
      badBinaries: { binaries: {} },
      historyArchivalStatus: 'DISABLED',
      historyArchivalURI: '',
      visibilityArchivalStatus: 'DISABLED',
      visibilityArchivalURI: '',
    },
    replicationConfiguration: {
      activeClusterName: 'staging_dca',
      clusters: [{ clusterName: 'staging_dca' }],
    },
    failoverVersion: -24,
    isGlobalDomain: false,
  },
  {
    domainInfo: {
      name: 'recent-cadence-canary-global-4',
      status: 'REGISTERED',
      description: 'Global domain for cadence canaries',
      ownerEmail: '',
      data: {},
      uuid: '4',
    },
    configuration: {
      workflowExecutionRetentionPeriodInDays: 1,
      emitMetric: true,
      badBinaries: { binaries: {} },
      historyArchivalStatus: 'DISABLED',
      historyArchivalURI: '',
      visibilityArchivalStatus: 'DISABLED',
      visibilityArchivalURI: '',
    },
    replicationConfiguration: {
      activeClusterName: 'staging_dca',
      clusters: [
        { clusterName: 'staging_dca' },
        { clusterName: 'staging_phx' },
      ],
    },
    failoverVersion: -24,
    isGlobalDomain: true,
  },
  {
    domainInfo: {
      name: 'recent-cadence-canary-local-5',
      status: 'REGISTERED',
      description: 'Local domain for cadence canaries',
      ownerEmail: '',
      data: {},
      uuid: '5',
    },
    configuration: {
      workflowExecutionRetentionPeriodInDays: 1,
      emitMetric: true,
      badBinaries: { binaries: {} },
      historyArchivalStatus: 'DISABLED',
      historyArchivalURI: '',
      visibilityArchivalStatus: 'DISABLED',
      visibilityArchivalURI: '',
    },
    replicationConfiguration: {
      activeClusterName: 'staging_dca',
      clusters: [{ clusterName: 'staging_dca' }],
    },
    failoverVersion: -24,
    isGlobalDomain: false,
  },
  {
    domainInfo: {
      name: 'recent-cadence-canary-global-6',
      status: 'REGISTERED',
      description: 'Global domain for cadence canaries',
      ownerEmail: '',
      data: {},
      uuid: '6',
    },
    configuration: {
      workflowExecutionRetentionPeriodInDays: 1,
      emitMetric: true,
      badBinaries: { binaries: {} },
      historyArchivalStatus: 'DISABLED',
      historyArchivalURI: '',
      visibilityArchivalStatus: 'DISABLED',
      visibilityArchivalURI: '',
    },
    replicationConfiguration: {
      activeClusterName: 'staging_dca',
      clusters: [
        { clusterName: 'staging_dca' },
        { clusterName: 'staging_phx' },
      ],
    },
    failoverVersion: -24,
    isGlobalDomain: true,
  },
];
