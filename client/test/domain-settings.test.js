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

describe('Domain Settings', () => {
  async function domainConfigTest(mochaTest, desc) {
    const [testEl, scenario] = new Scenario(mochaTest)
      .withDomain('ci-test')
      .startingAt('/domains/ci-test/settings')
      .withFeatureFlags()
      .withEmptyNewsFeed()
      .withDomainDescription('ci-test', desc)
      .go();

    const configEl = await testEl.waitUntilExists('section.domain-settings');

    return [configEl, scenario];
  }

  it('should show properties in a readable form from the domain description API', async function test() {
    const [configEl] = await domainConfigTest(this.test);

    await configEl.waitUntilExists('dl.details dt');
    configEl.should.have.descendant('header h3').with.text('ci-test');
    configEl
      .textNodes('dl.details dt')
      .should.deep.equal([
        'description',
        'owner',
        'Global?',
        'Retention Period',
        'Emit Metrics',
        'History Archival',
        'Visibility Archival',
        'Failover Version',
        'clusters',
      ]);
    configEl
      .textNodes('dl.details dd')
      .should.deep.equal([
        'A cool domain',
        'ci-test@uber.com',
        'No',
        '21 days',
        'Yes',
        'Enabled',
        'Disabled',
        '0',
        'ci-test-cluster (active)',
      ]);
  });
});
