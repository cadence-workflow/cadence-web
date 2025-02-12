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

const formatEnum = require('./format-enum');

const formatListDomains = ({ domains, nextPageToken }) => ({
  domains: domains.map(
    ({
      activeClusterName,
      badBinaries,
      clusters,
      data,
      description,
      failoverInfo,
      failoverVersion,
      historyArchivalStatus,
      historyArchivalUri,
      id,
      isGlobalDomain,
      name,
      ownerEmail,
      status,
      visibilityArchivalStatus,
      visibilityArchivalUri,
      workflowExecutionRetentionPeriod,
    }) => ({
      configuration: {
        badBinaries,
        emitMetric: true, // DEPRECATED
        historyArchivalStatus: formatEnum(
          historyArchivalStatus,
          'ARCHIVAL_STATUS'
        ),
        historyArchivalURI: historyArchivalUri ? historyArchivalUri : null,
        visibilityArchivalStatus: formatEnum(
          visibilityArchivalStatus,
          'ARCHIVAL_STATUS'
        ),
        visibilityArchivalURI: visibilityArchivalUri
          ? visibilityArchivalUri
          : null,
        workflowExecutionRetentionPeriodInDays:
          workflowExecutionRetentionPeriod.seconds / (60 * 60 * 24),
      },
      domainInfo: {
        data: data ? data : null,
        description,
        name,
        ownerEmail: ownerEmail ? ownerEmail : null,
        status: formatEnum(status, 'DOMAIN_STATUS'),
        uuid: id ? id : null,
      },
      failoverInfo,
      failoverVersion: parseInt(failoverVersion),
      isGlobalDomain,
      replicationConfiguration: {
        activeClusterName,
        clusters,
      },
    })
  ),
  nextPageToken,
});

module.exports = formatListDomains;
