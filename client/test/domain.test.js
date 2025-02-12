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

import { getFixture } from './helpers';

const crossRegionSpecificFlags = [
  'crossRegion',
  'crossRegion.activeStatusTag',
  'crossRegion.allowedCrossOrigin',
  'crossRegion.clusterOriginList',
];

const featureFlagsForMultipleClustersEnv = [
  ...getFixture('featureFlags').filter(
    ({ key }) => !crossRegionSpecificFlags.includes(key)
  ),
  {
    key: 'crossRegion',
    value: true,
  },
  {
    key: 'crossRegion.activeStatusTag',
    value: true,
  },
  {
    key: 'crossRegion.allowedCrossOrigin',
    value: true,
  },
  {
    key: 'crossRegion.clusterOriginList',
    value: [
      {
        clusterName: 'primary',
        origin: 'http://localhost:8090',
      },
      {
        clusterName: 'ci-test-cluster',
        origin: 'http://localhost:8090',
      },
    ],
  },
];

const featureFlagsForSingleClusterEnv = [
  ...getFixture('featureFlags').filter(
    ({ key }) => !crossRegionSpecificFlags.includes(key)
  ),
  {
    key: 'crossRegion',
    value: false,
  },
  {
    key: 'crossRegion.activeStatusTag',
    value: false,
  },
  {
    key: 'crossRegion.allowedCrossOrigin',
    value: false,
  },
  {
    key: 'crossRegion.clusterOriginList',
    value: [],
  },
];

describe('Domain ', () => {
  async function domainTest(mochaTest, { desc, featureFlags } = {}) {
    const [testEl, scenario] = new Scenario(mochaTest)
      .withCluster()
      .withDomain('ci-test')
      .withDomainAuthorization('ci-test', true)
      .withFeatureFlags(featureFlags)
      .withEmptyNewsFeed()
      .withDomainDescription('ci-test', desc)
      .withWorkflows({ status: 'open' })
      .withWorkflows({ status: 'closed', startTimeOffset: 30 })
      .startingAt('/domains/ci-test?t=test')
      .go();

    return [testEl, scenario];
  }

  it('should redirect to cluster if it is missing in the url in a cross region domain environment while preserving queryParams', async function test() {
    // if clusterName is missing in the url and active cluser exists
    // make sure to redirect to add cluster to url
    // we make sure the activeCluster config exists by passing feature flags for crossRegion configs
    const [testEl, scenario] = await domainTest(this.test, {
      featureFlags: featureFlagsForMultipleClustersEnv,
    });

    await testEl.waitUntilExists('.feature-flag .active-status');
    scenario.location.should.contain('/ci-test-cluster');
    // query paramas should be preserveded
    scenario.location.should.contain('t=test');
  });

  it('should not redirect to cluster if it is missing in the url in a non cross region domain environment', async function test() {
    const [testEl, scenario] = await domainTest(this.test, {
      featureFlags: featureFlagsForSingleClusterEnv,
    });

    // make sure that cross region is not in the dom before asserting on the location
    const statusEl = await testEl
      .waitUntilExists('.feature-flag .active-status')
      .catch(() => {
        scenario.location.should.not.contain('/ci-test-cluster');

        return null;
      });

    (statusEl === null).should.equal(true);
  });
});
