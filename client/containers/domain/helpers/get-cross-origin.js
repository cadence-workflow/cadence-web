// Copyright (c) 2021-2025 Uber Technologies Inc.
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

const getCrossOrigin = ({
  allowedCrossOrigin,
  clusterName,
  clusterOriginList,
  crossRegion,
  domain,
}) => {
  if (
    !domain ||
    !crossRegion ||
    !allowedCrossOrigin ||
    !clusterOriginList ||
    !clusterOriginList.length
  ) {
    return window.location.origin;
  }

  const {
    replicationConfiguration: { activeClusterName, clusters },
  } = domain;

  const matchedActiveClusterOrigin = clusterOriginList.find(
    ({ clusterName: matchClusterName }) =>
      matchClusterName === activeClusterName
  );
  const matchedCluster =
    clusterName &&
    clusters.find(
      ({ clusterName: matchClusterName }) => matchClusterName === clusterName
    );
  const matchedClusterOrigin = clusterOriginList.find(
    ({ clusterName: matchClusterName }) =>
      matchedCluster && matchClusterName === clusterName
  );
  const origin =
    (matchedClusterOrigin && matchedClusterOrigin.origin) ||
    (matchedActiveClusterOrigin && matchedActiveClusterOrigin.origin);

  if (!origin) {
    console.warn(
      `could not find clusterName "${clusterName}" or "${activeClusterName}" in crossRegion.clusterOriginList.`
    );
  }

  return origin || window.location.origin;
};

export default getCrossOrigin;
