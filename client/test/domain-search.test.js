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

describe('Domain search', () => {
  it('should show a header bar without a breadcrumb or domain changer', async function test() {
    const [testEl] = new Scenario(this.test)
      .withFeatureFlags()
      .withEmptyNewsFeed()
      .go();

    const headerBar = await testEl.waitUntilExists('header.top-bar');

    headerBar.should.have
      .descendant('a.logo svg')
      .and.have.descendant('text')
      .with.text('adence');
    headerBar.should.not.contain('nav').and.not.contain('div.domain');
  });

  it('should show a list of domains when the user types', async function() {
    const [testEl] = new Scenario(this.test)
      .withFeatureFlags()
      .withEmptyNewsFeed()
      .withDomainSearch()
      .go();

    const domainInput = await testEl.waitUntilExists(
      'section.domain-search .domain-autocomplete input'
    );

    domainInput.input('ci-tests');

    // wait for debounce & request to finish
    await Promise.delay(200);

    const domainAutocompleteList = await testEl.waitUntilExists(
      'section.domain-search .domain-autocomplete ul.vs__dropdown-menu'
    );

    const domainListItem = domainAutocompleteList.querySelector('li');

    domainListItem.should.have.trimmed.text('ci-tests - Local - primary');
  });

  it('should go to the workflows of the domain requested when selected', async function test() {
    const [testEl, scenario] = new Scenario(this.test)
      .withFeatureFlags()
      .withEmptyNewsFeed()
      .withDomainSearch()
      .go();

    const domainInput = await testEl.waitUntilExists(
      'section.domain-search .domain-navigation input'
    );

    domainInput.input('ci-tests');

    // wait until results load
    await testEl.waitUntilExists(
      'section.domain-search .domain-autocomplete ul.vs__dropdown-menu li.vs__dropdown-option'
    );

    const domainAutocompleteList = await testEl.waitUntilExists(
      'section.domain-search .domain-autocomplete ul.vs__dropdown-menu'
    );

    const domainListItem = domainAutocompleteList.querySelectorAll('li');

    scenario
      .withFeatureFlags()
      .withDomain('ci-tests')
      .withWorkflows({ status: 'open' })
      .withWorkflows({ status: 'closed', startTimeOffset: 30 })
      .withDomainDescription('ci-tests');

    domainListItem.click();

    await testEl.waitUntilExists('section.workflow-list');
    const headerBar = testEl.querySelector('header.top-bar');

    headerBar.should.have
      .descendant('.workflows')
      .that.contains.text('ci-test');
    scenario.location.should.contain('/domains/ci-tests/workflows');
    localStorage.getItem('recent-domains').should.equal('["ci-tests"]');
  });

  it('should activate the change-domain button when the domain is valid and navigate to it', async function test() {
    const [testEl, scenario] = new Scenario(this.test)
      .withFeatureFlags()
      .withEmptyNewsFeed()
      .go();

    const domainNav = await testEl.waitUntilExists(
      'section.domain-search .domain-navigation'
    );
    const domainInput = domainNav.querySelector('input');
    const changeDomain = domainNav.querySelector('a.change-domain');

    changeDomain.should.have.attr('href', '');
    scenario.api.getOnce('/api/domains/ci-', 404);
    domainInput.input('ci-');

    await retry(() => domainNav.should.have.class('validation-invalid'));
    changeDomain.should.have.attr('href', '');

    await Promise.delay(50);

    scenario.withDomainDescription('ci-tests');
    domainInput.input('ci-tests');

    await testEl.waitUntilExists('.domain-navigation.validation-valid');
    changeDomain.should.have.attr('href', '#');
    scenario
      .withDomain('ci-tests')
      .withDomainDescription('ci-tests')
      .withWorkflows({ status: 'open' })
      .withWorkflows({ status: 'closed', startTimeOffset: 30 });
    changeDomain.trigger('click');

    await testEl.waitUntilExists('section.workflow-list');
    const headerBar = testEl.querySelector('header.top-bar');

    headerBar.should.have
      .descendant('.workflows')
      .that.contains.text('ci-test');
    scenario.location.should.contain('/domains/ci-tests/workflows');
    localStorage.getItem('recent-domains').should.equal('["ci-tests"]');

    await Promise.delay(100);
  });

  it('should show recent domains with links to them', async function test() {
    localStorage.setItem(
      'recent-domains',
      JSON.stringify(['demo', 'ci-tests'])
    );
    const [testEl, scenario] = new Scenario(this.test)
      .withFeatureFlags()
      .withEmptyNewsFeed()
      .go();

    const recentDomains = await testEl.waitUntilExists(
      '.domain-navigation ul.recent-domains'
    );

    recentDomains.should.have
      .descendant('h3')
      .with.trimmed.text('Recent Domains');
    recentDomains.textNodes('li a').should.deep.equal(['demo', 'ci-tests']);

    recentDomains.querySelectorAll('li a')[1].trigger('click');
    scenario
      .withDomain('ci-tests')
      .withDomainDescription('ci-tests')
      .withWorkflows({ status: 'open' })
      .withWorkflows({ status: 'closed', startTimeOffset: 30 });

    await testEl.waitUntilExists('section.workflow-list');
    localStorage.getItem('recent-domains').should.equal('["ci-tests","demo"]');
  });

  it('should show a description of recent domains when hovered', async function test() {
    localStorage.setItem(
      'recent-domains',
      JSON.stringify(['demo', 'ci-tests'])
    );
    const [testEl, scenario] = new Scenario(this.test)
      .withFeatureFlags()
      .withEmptyNewsFeed()
      .go();

    const recentDomains = await testEl.waitUntilExists(
      '.domain-navigation ul.recent-domains'
    );

    scenario.withDomainDescription('demo', {
      domainInfo: { description: 'demo playground' },
      configuration: { workflowExecutionRetentionPeriodInDays: 3 },
    });
    recentDomains.querySelectorAll('li a')[0].trigger('mouseover');

    const descriptionEl = await testEl.waitUntilExists(
      'section.domain-search .domain-description'
    );

    descriptionEl
      .textNodes('dl.details dd')
      .should.deep.equal([
        'demo playground',
        'ci-test@uber.com',
        'No',
        '3 days',
        'Yes',
        'Enabled',
        'Disabled',
        '0',
        'ci-test-cluster (active)',
      ]);
  });
});
