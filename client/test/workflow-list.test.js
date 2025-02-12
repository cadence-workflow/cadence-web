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

import moment from 'moment';
import { getFixture } from './helpers';

describe('Workflow list', () => {
  async function workflowsTest(mochaTest, workflows, query, domainDesc) {
    const [testEl, scenario] = new Scenario(mochaTest)
      .startingAt('/domains/ci-test/workflows')
      .withCluster()
      .withDomain('ci-test')
      .withDomainDescription('ci-test', domainDesc)
      .withEmptyNewsFeed()
      .withFeatureFlags()
      .withWorkflows({ status: 'open', query, workflows })
      .withWorkflows({
        status: 'closed',
        query,
        workflows,
        startTimeOffset: 30,
      })
      .go();

    await testEl.waitUntilExists('section.workflow-list.ready');

    return [testEl, scenario];
  }

  const demoWf = [
    {
      execution: {
        workflowId: 'demoWfId',
        runId: 'demoRunId',
      },
      type: { name: 'demo' },
    },
  ];

  it('should query for all workflows and show the results in a grid', async function test() {
    const [workflowsEl] = await workflowsTest(this.test);
    const resultsEl = workflowsEl.querySelector(
      'section.workflow-grid-wrapper'
    );

    workflowsEl
      .querySelector('[data-cy="status-filter"] .vs__selected')
      .should.contain.text('All');

    await resultsEl.waitUntilExists('.workflow-grid.ready');

    resultsEl
      .textNodes('.row-header > div')
      .should.deep.equal([
        'Workflow ID',
        'Run ID',
        'Name',
        'Status',
        'Start Time',
        'End Time',
      ]);

    resultsEl
      .textNodes('.row > .col-id')
      .should.deep.equal([
        'github.com/uber/cadence-web/email-daily-summaries-2',
        'github.com/uber/cadence-web/example-1',
        'email-daily-summaries',
      ]);

    resultsEl
      .textNodes('.row > .col-link')
      .should.deep.equal([
        'ef2c889e-e709-4d50-99ee-3748dfa0a101',
        'db8da3c0-b7d3-48b7-a9b3-b6f566e58207',
        '51ccc0d1-6ffe-4a7a-a89f-6b5154df86f7',
      ]);

    resultsEl
      .attrValues('.row > .col-link a', 'href')
      .should.deep.equal([
        '/domains/ci-test/workflows/github.com%2Fuber%2Fcadence-web%2Femail-daily-summaries-2/ef2c889e-e709-4d50-99ee-3748dfa0a101/summary',
        '/domains/ci-test/workflows/github.com%2Fuber%2Fcadence-web%2Fexample-1/db8da3c0-b7d3-48b7-a9b3-b6f566e58207/summary',
        '/domains/ci-test/workflows/email-daily-summaries/51ccc0d1-6ffe-4a7a-a89f-6b5154df86f7/summary',
      ]);

    resultsEl
      .textNodes('.row > .col-name')
      .should.deep.equal([
        'email-daily-summaries',
        'example',
        'github.com/uber/cadence-web/email-daily-summaries-1',
      ]);

    resultsEl
      .textNodes('.row > .col-status')
      .should.deep.equal(['open', 'open', 'completed']);

    resultsEl
      .textNodes('.row > .col-start')
      .should.deep.equal([
        ...getFixture('workflows.open').map(wf =>
          moment(wf.startTime).format('MMM D, YYYY h:mm:ss A')
        ),
        ...getFixture('workflows.closed').map(wf =>
          moment(wf.startTime).format('MMM D, YYYY h:mm:ss A')
        ),
      ]);

    resultsEl
      .textNodes('.row > .col-end')
      .should.deep.equal([
        '',
        '',
        ...getFixture('workflows.closed').map(wf =>
          moment(wf.closeTime).format('MMM D, YYYY h:mm:ss A')
        ),
      ]);

    resultsEl.should.not
      .contain('span.no-results')
      .and.not.contain('span.error');
  });

  it('should allow filtering by workflow id', async function test() {
    const [workflowsEl, scenario] = await workflowsTest(this.test);
    const wfIdEl = workflowsEl.querySelector(
      'header.filters input[name="workflowId"]'
    );

    await Promise.delay(10);
    wfIdEl.value.should.be.empty;

    scenario
      .withWorkflows({
        status: 'open',
        query: {
          workflowId: '1234',
          filterBy: 'StartTime',
        },
        workflows: [
          {
            execution: {
              workflowId: '1234',
              runId: '5678',
            },
            type: { name: 'demo' },
          },
        ],
      })
      .withWorkflows({
        status: 'closed',
        startTimeOffset: 30,
        query: {
          workflowId: '1234',
        },
        workflows: [],
      });

    wfIdEl.input('1234');

    await workflowsEl.waitUntilExists('section.workflow-list.ready');

    await retry(() =>
      workflowsEl.textNodes('.row > .col-name').should.deep.equal(['demo'])
    );
  });

  it('should respect query parameters for range and status', async function test() {
    const [testEl] = new Scenario(this.test)
      .startingAt(
        '/domains/ci-test/workflows?status=FAILED&range=last-24-hours'
      )
      .withCluster()
      .withDomain('ci-test')
      .withDomainDescription('ci-test')
      .withEmptyNewsFeed()
      .withFeatureFlags()
      .withWorkflows({
        status: 'closed',
        query: {
          startTime: moment()
            .subtract(24, 'hours')
            .startOf('hour')
            .toISOString(),
          endTime: moment()
            .endOf('hour')
            .toISOString(),
          status: 'FAILED',
          filterBy: 'CloseTime',
        },
      })
      .go();

    await retry(() =>
      testEl
        .querySelectorAll(
          'section.workflow-list section.workflow-grid-wrapper .row'
        )
        .should.have.length(1)
    );
    await Promise.delay(50);
  });

  it('should allow filtering by workflow name', async function test() {
    const [workflowsEl, scenario] = await workflowsTest(this.test);
    const wfNameEl = workflowsEl.querySelector(
      'header.filters input[name="workflowName"]'
    );

    await Promise.delay(10);
    wfNameEl.value.should.be.empty;

    scenario
      .withWorkflows({
        status: 'open',
        query: {
          workflowName: 'demo',
        },
        workflows: demoWf,
      })
      .withWorkflows({
        status: 'closed',
        startTimeOffset: 30,
        query: {
          workflowName: 'demo',
        },
        workflows: [],
      });
    wfNameEl.input('demo');

    await retry(() =>
      workflowsEl
        .textNodes(
          'section.workflow-list section.workflow-grid-wrapper .row .col-id'
        )
        .should.deep.equal(['demoWfId'])
    );
  });

  it('should allow querying by status of the workflow', async function test() {
    const [workflowsEl, scenario] = await workflowsTest(this.test);
    const statusEl = workflowsEl.querySelector(
      'header.filters [data-cy="status-filter"]'
    );

    await retry(() =>
      statusEl.querySelector('.vs__selected').should.have.trimmed.text('All')
    );

    scenario.withWorkflows({
      status: 'closed',
      query: { status: 'FAILED', filterBy: 'CloseTime' },
      workflows: demoWf,
    });
    await statusEl.selectItem('Failed');

    await retry(() =>
      workflowsEl
        .textNodes(
          'section.workflow-list section.workflow-grid-wrapper .row .col-id'
        )
        .should.deep.equal(['demoWfId'])
    );
  });

  it('should debounce query criteria changes when issuing requests', async function test() {
    const [workflowsEl, scenario] = await workflowsTest(this.test);
    const wfIdEl = workflowsEl.querySelector(
      'header.filters input[name="workflowId"]'
    );

    scenario
      .withWorkflows({
        status: 'open',
        query: {
          workflowId: '1234',
        },
        workflows: [
          {
            execution: {
              workflowId: '1234',
              runId: '5678',
            },
            type: { name: 'demo' },
          },
        ],
      })
      .withWorkflows({
        status: 'closed',
        startTimeOffset: 30,
        query: {
          workflowId: '1234',
        },
        workflows: [],
      });

    wfIdEl.input('12');
    Promise.delay(5);
    wfIdEl.input('123');
    Promise.delay(5);
    wfIdEl.input('1234');

    await retry(() =>
      workflowsEl
        .textNodes(
          'section.workflow-list section.workflow-grid-wrapper .row .col-name'
        )
        .should.deep.equal(['demo'])
    );
  });

  it('should show errors from the server', async function test() {
    const [workflowsEl] = await workflowsTest(this.test, {
      status: 503,
      body: {
        message: 'Server Unavailable',
      },
    });

    await retry(() =>
      workflowsEl
        .querySelector('span.error')
        .should.have.text('Server Unavailable')
    );
  });

  it('should not show the table of results when there are no results', async function test() {
    const [workflowsEl] = await workflowsTest(this.test, []);

    await retry(() => {
      workflowsEl.querySelector('div.no-results').should.be.displayed;
      workflowsEl
        .querySelector('section.workflow-grid-wrapper')
        .should.not.contain('.results');
    });
  });

  it('should use query parameters from the URL', async function test() {
    const [testEl] = new Scenario(this.test)
      .startingAt('/domains/ci-test/workflows?status=FAILED&workflowName=demo')
      .withCluster()
      .withDomain('ci-test')
      .withDomainDescription('ci-test')
      .withEmptyNewsFeed()
      .withFeatureFlags()
      .withWorkflows({
        status: 'closed',
        query: {
          status: 'FAILED',
          workflowName: 'demo',
          filterBy: 'CloseTime',
        },
      })
      .go();

    const workflowsEl = await testEl.waitUntilExists(
      'section.workflow-list.ready'
    );

    workflowsEl
      .querySelector('header.filters input[name="workflowName"]')
      .value.should.equal('demo');
    workflowsEl
      .querySelector('header.filters [data-cy="status-filter"] .vs__selected')
      .should.have.trimmed.text('Failed');
  });

  it('should call list API when filterMode = advanced and queryString query params are set', async function test() {
    const [testEl] = new Scenario(this.test)
      .startingAt(
        '/domains/ci-test/workflows?status=FAILED&queryString=demo&filterMode=advanced'
      )
      .withCluster()
      .withDomain('ci-test')
      .withDomainDescription('ci-test')
      .withEmptyNewsFeed()
      .withFeatureFlags()
      .withWorkflows({
        status: 'list',
        query: {
          queryString: 'demo',
        },
      })
      .go();

    const workflowsEl = await testEl.waitUntilExists(
      'section.workflow-list.ready'
    );

    workflowsEl
      .querySelector('header.filters input[name="queryString"]')
      .value.should.equal('demo');
  });
});
