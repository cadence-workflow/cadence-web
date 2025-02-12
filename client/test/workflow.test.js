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

import MockDate from 'mockdate';
import moment from 'moment';
import { getFixture } from './helpers';

describe('Workflow', () => {
  function workflowTest(mochaTest, options) {
    const extendedOptions = {
      workflowId: 'email-daily-summaries',
      runId: 'emailRun1',
      view: 'summary',
      ...options,
    };

    return [
      new Scenario(mochaTest)
        .withDomain('ci-test')
        .withDomainAuthorization('ci-test', true)
        .withFeatureFlags()
        .withEmptyNewsFeed()
        .withStoreState({
          workflowHistory: {
            graphEnabled: true,
          },
        })
        .withWorkflow(
          extendedOptions.workflowId,
          extendedOptions.runId,
          extendedOptions.execution
        )
        .withTaskList('ci_task_list')
        .startingAt(
          `/domains/ci-test/workflows/${extendedOptions.workflowId}/${
            extendedOptions.runId
          }/${extendedOptions.view}${
            extendedOptions.query ? `?${extendedOptions.query}` : ''
          }`
        ),
      extendedOptions,
    ];
  }

  async function summaryTest(mochaTest, options = {}, loading) {
    const [scenario, opts] = workflowTest(mochaTest, {
      view: 'summary',
      ...options,
    });

    scenario.withFullHistory(opts.events, options.history);

    const summaryEl = await scenario
      .render(opts.attach)
      .waitUntilExists(`section.execution.${loading ? 'loading' : 'ready'}`);

    await summaryEl.waitUntilExists('section.workflow-summary dl');

    return [summaryEl.parentElement, scenario];
  }

  async function waitUntilCompleted(element) {
    return element.waitUntilExists('section.execution.ready');
  }

  const closedWorkflowExecution = {
    workflowExecutionInfo: {
      closeTime: moment().subtract(1, 'day'),
      closeStatus: 'COMPLETED',
      type: {},
      execution: {},
    },
  };

  describe('Workflow Statistics', () => {
    it('should show statistics from the workflow', async function test() {
      const [summaryEl] = await summaryTest(this.test, {}, true);

      summaryEl
        .querySelector('.workflow-id dd')
        .should.have.text('email-daily-summaries');

      summaryEl.querySelector('.run-id dd').should.have.text('emailRun1');

      summaryEl.querySelector('.history-length dd').should.have.text('14');

      summaryEl
        .querySelector('.workflow-name dd')
        .should.have.text('CIDemoWorkflow');

      summaryEl
        .querySelector('.task-list dd a[href]')
        .should.contain.text('ci_task_list')
        .and.have.attr('href', '/domains/ci-test/task-lists/ci_task_list');

      summaryEl.querySelector('.started-at dd').should.have.text(
        moment()
          .startOf('hour')
          .subtract(2, 'minutes')
          .format('MMM D, YYYY h:mm:ss A')
      );

      summaryEl.should.not.have.descendant('.close-time');

      summaryEl.should.not.have.descendant('.pending-activities');

      summaryEl.should.not.have.descendant('.parent-workflow');

      summaryEl
        .querySelector('.cron-schedule dd')
        .should.have.text('30 * * * *');

      summaryEl
        .querySelector('.workflow-status dd')
        .should.contain.text('running');

      summaryEl
        .querySelector('.workflow-status loader.bar')
        .should.not.have.property('display', 'none');

      await waitUntilCompleted(summaryEl);
    });
  });

  describe('Summary', () => {
    it('should show the input of the workflow, and any pending events', async function test() {
      const [summaryEl] = await summaryTest(this.test, {
        execution: {
          pendingActivities: [
            {
              activityId: 4,
              status: 'STARTED',
            },
            {
              activityId: 5,
              status: 'QUEUED',
            },
          ],
        },
      });

      summaryEl
        .querySelectorAll('.pending-activities dl.details')
        .should.have.length(2);
      summaryEl
        .textNodes('.pending-activities dt')
        .should.deep.equal([
          'Pending Activities',
          'activityId',
          'status',
          'activityId',
          'status',
        ]);
      summaryEl
        .textNodes('.pending-activities > dd:first-of-type dd')
        .should.deep.equal(['4', 'STARTED']);
      summaryEl
        .textNodes('.pending-activities > dd:nth-of-type(2) dd')
        .should.deep.equal(['5', 'QUEUED']);

      summaryEl
        .querySelector('.workflow-input pre')
        .should.have.text(JSON.stringify([839134, { env: 'prod' }], null, 2));
    });

    it('should show a full screen view option for input that overflows the area', async function test() {
      const input = {
        foo: 1,
        bar: 'a',
        baz: new Array(100).fill('aa').join('|'),
      };

      const [summaryEl, scenario] = await summaryTest(this.test, {
        attach: true,
        events: [
          {
            eventId: 1,
            eventType: 'WorkflowExecutionStarted',
            details: {
              type: {
                name: 'ci-input-overflow-test',
              },
              execution: {},
              input,
            },
            timestamp: new Date().toISOString(),
          },
        ],
      });
      const inputDataView = await summaryEl.waitUntilExists(
        '.workflow-input .data-viewer'
      );

      inputDataView.should.have
        .class('overflow')
        .and.have.descendant('a.view-full-screen').and.be.displayed;

      inputDataView.querySelector('a.view-full-screen').trigger('click');

      const modal = await scenario.vm.$el.waitUntilExists(
        '[data-modal="data-viewer-fullscreen"]'
      );

      await retry(() => {
        modal.should.have
          .descendant('h3')
          .with.text('email-daily-summaries Input');
        modal.should
          .contain('a.copy')
          .and.contain('a.close')
          .and.have.descendant('pre.language-json')
          .with.text(JSON.stringify(input, null, 2));
      });
    });

    it('should link to the new workflow if the status is ContinuedAsNew', async function test() {
      const [summaryEl] = await summaryTest(this.test, {
        attach: true,
        events: [
          {
            eventId: 1,
            eventType: 'WorkflowExecutionStarted',
            details: {
              type: {
                name: 'ci-input-overflow-test',
              },
              execution: {},
              input: { greet: 'hello' },
            },
            timestamp: new Date().toISOString(),
          },
          {
            timestamp: '2018-08-16T01:00:01.582Z',
            eventType: 'WorkflowExecutionContinuedAsNew',
            eventId: 42,
            details: {
              newExecutionRunId: '617d8b6f-ea42-479c-bc7c-0ec4dacddf64',
              workflowType: {
                name:
                  'code.uber.internal/marketplace/dsp-scheduler/scheduler/workflow.CTBWorkflow',
              },
              taskList: {
                name: 'ctb-decider',
                kind: null,
              },
              input: {
                CityID: 240,
                CurTime: '',
                BudgetGroup: 'budget_group_1',
              },
              executionStartToCloseTimeoutSeconds: 2604800,
              taskStartToCloseTimeoutSeconds: 300,
              decisionTaskCompletedEventId: 41,
            },
          },
        ],
      });

      const wfStatusEl = await summaryEl.waitUntilExists(
        '.workflow-status[data-status="continued-as-new"]'
      );

      wfStatusEl.should.contain
        .descendant('dd a')
        .and.have.text('Continued As New')
        .and.have.attr(
          'href',
          '/domains/ci-test/workflows/email-daily-summaries/617d8b6f-ea42-479c-bc7c-0ec4dacddf64/summary'
        );
    });

    it('should show the result of the workflow if completed', async function test() {
      const [summaryEl] = await summaryTest(this.test);
      const resultsEl = await summaryEl.waitUntilExists('.workflow-result pre');
      const historyFixture = getFixture('history.emailRun1');

      JSON.parse(resultsEl.textContent).should.deep.equal(
        historyFixture[historyFixture.length - 1].details.result
      );
      resultsEl
        .textNodes('.token.string')
        .should.deep.equal([
          '"bob@example.com"',
          '"jane@example.com"',
          '"foobarbaz"',
        ]);
    });

    it('should show the failure result from a failed workflow', async function test() {
      const [summaryEl] = await summaryTest(this.test, {
        events: getFixture('history.exampleTimeout'),
      });
      const resultsEl = await summaryEl.waitUntilExists('.workflow-result pre');

      JSON.parse(resultsEl.textContent).should.deep.equal({
        reason: 'activityTimeout',
        activityId: 0,
      });
    });

    it('should have a link to a parent workflow if applicable', async function test() {
      const [summaryEl] = await summaryTest(this.test, {
        events: [
          {
            eventType: 'WorkflowExecutionStarted',
            timestamp: moment().toISOString(),
            eventId: 1,
            details: {
              workflowType: { name: 'com.github/uber/ci-test-parent' },
              parentWorkflowDomain: 'another-domain',
              parentWorkflowExecution: {
                workflowId: 'the-parent-wfid',
                runId: '1234',
              },
            },
          },
          {
            eventId: 1,
            eventType: 'DecisionTaskScheduled',
            timestamp: moment().toISOString(),
          },
        ],
      });
      const parentWf = await summaryEl.waitUntilExists('.parent-workflow');

      parentWf
        .querySelector('dd a')
        .should.contain.text('the-parent-wfid')
        .and.have.attr(
          'href',
          '/domains/another-domain/workflows/the-parent-wfid/1234/summary'
        );
    });

    describe('Actions', () => {
      it('should offer the user to terminate a running workflow, prompting the user for a termination reason', async function test() {
        const [summaryEl] = await summaryTest(
          this.test,
          {
            history: { delay: 500 },
          },
          true
        );

        const terminateEl = await summaryEl.waitUntilExists(
          'aside.actions button'
        );

        await retry(() => terminateEl.should.not.have.attr('disabled'));

        terminateEl.trigger('click');

        const confirmTerminateEl = await summaryEl.waitUntilExists(
          '[data-modal="confirm-termination"]'
        );

        await Promise.delay(50);

        confirmTerminateEl.should.contain.text(
          'Are you sure you want to terminate this workflow?'
        );
        confirmTerminateEl.should
          .contain('button[name="button-terminate"]')
          .and.contain('button[name="button-cancel"]')
          .and.contain('input[placeholder="Reason"]');

        await waitUntilCompleted(summaryEl);
      });

      it('should terminate the workflow with the provided reason', async function test() {
        const [summaryEl, scenario] = await summaryTest(
          this.test,
          {
            history: { delay: 250 },
          },
          true
        );

        const terminateEl = await summaryEl.waitUntilExists(
          'aside.actions button'
        );

        await retry(() => terminateEl.should.not.have.attr('disabled'));

        terminateEl.trigger('click');

        const confirmTerminateEl = await summaryEl.waitUntilExists(
          '[data-modal="confirm-termination"]'
        );
        const reasonEl = confirmTerminateEl.querySelector('input');

        reasonEl.value = 'example termination';
        reasonEl.trigger('input');
        await Promise.delay(10);

        scenario.withWorkflowTermination('example termination');
        confirmTerminateEl
          .querySelector('button[name="button-terminate"]')
          .trigger('click');
        await retry(() =>
          summaryEl.should.not.contain('[data-modal="confirm-termination"]')
        );

        await waitUntilCompleted(summaryEl);
      });

      it('should terminate the workflow without a reason', async function test() {
        const [summaryEl, scenario] = await summaryTest(
          this.test,
          {
            history: { delay: 250 },
          },
          true
        );

        const terminateEl = await summaryEl.waitUntilExists(
          'aside.actions button'
        );

        await retry(() => terminateEl.should.not.have.attr('disabled'));

        terminateEl.trigger('click');

        const terminateConfirmEl = await summaryEl.waitUntilExists(
          '[data-modal="confirm-termination"] button[name="button-terminate"]'
        );

        scenario.withWorkflowTermination();
        terminateConfirmEl.trigger('click');

        await retry(() =>
          summaryEl.should.not.contain('[data-modal="confirm-termination"]')
        );

        await waitUntilCompleted(summaryEl);
      });

      it('should allow the user to cancel the termination prompt, doing nothing', async function test() {
        const [summaryEl] = await summaryTest(
          this.test,
          {
            history: { delay: 250 },
          },
          true
        );

        const terminateEl = await summaryEl.waitUntilExists(
          'aside.actions button'
        );

        await retry(() => terminateEl.should.not.have.attr('disabled'));

        terminateEl.trigger('click');

        const cancelDialog = await summaryEl.waitUntilExists(
          '[data-modal="confirm-termination"] button[name="button-cancel"]'
        );

        cancelDialog.trigger('click');
        await retry(() =>
          summaryEl.should.not.contain('[data-modal="confirm-termination"]')
        );

        await waitUntilCompleted(summaryEl);
      });

      it('should not offer the user the ability to terminate completed workflows', async function test() {
        const [summaryEl] = await summaryTest(this.test, {
          execution: closedWorkflowExecution,
          history: { delay: 250 },
        });

        await retry(() =>
          summaryEl.should.have
            .descendant('.workflow-status dd')
            .and.have.trimmed.text('completed')
        );
        summaryEl.should.have.descendant('aside.actions button.disabled');
      });
    });
  });

  describe('History', () => {
    async function historyTest(mochaTest, o) {
      const [scenario, opts] = workflowTest(mochaTest, {
        view: 'history',
        ...o,
      });

      scenario.withFullHistory(opts.events).withExportHistory(opts.events);

      const historyEl = await scenario
        .render(opts.attach)
        .waitUntilExists('section.execution.ready');

      return [historyEl, scenario, opts];
    }
    it('should pick default view format from localstorage if exists ', async function test() {
      localStorage.setItem('ci-test:history-viewing-format', 'json');
      const [historyEl] = await historyTest(this.test);

      historyEl
        .querySelector('.view-formats .json')
        .should.have.class('active');
    });
    it('should set default view format to compact if no persisted selection in localstorage', async function test() {
      localStorage.removeItem('ci-test:history-viewing-format');
      const [historyEl] = await historyTest(this.test);

      historyEl
        .querySelector('.view-formats .compact')
        .should.have.class('active');
    });

    it('should allow the user to change the view format', async function test() {
      const [historyEl, scenario] = await historyTest(this.test);

      await historyEl.waitUntilExists('section.results');
      const resultsEl = historyEl.querySelector('section.results');

      historyEl.querySelector('.view-formats a.grid').trigger('click');

      await retry(() =>
        resultsEl.querySelectorAll('.tr').should.have.length(6)
      );
      resultsEl.should.not.have.descendant('pre.json');
      resultsEl.should.not.have.descendant('.compact-view');

      historyEl.querySelector('.view-formats a.compact').trigger('click');
      await retry(() =>
        historyEl
          .querySelectorAll('.compact-view .timeline-event')
          .should.have.length(2)
      );

      resultsEl.should.not.have.descendant('pre.json');
      resultsEl.should.not.have.descendant('table');
      scenario.location.should.equal(
        '/domains/ci-test/workflows/email-daily-summaries/emailRun1/history?format=compact'
      );
      historyEl.querySelector('.view-formats a.json').trigger('click');

      const jsonView = await resultsEl.waitUntilExists(
        'pre.json.language-json'
      );

      jsonView.should.contain.text('"eventId":');
      resultsEl.should.not.have.descendant('.compact-view');
      scenario.location.should.equal(
        '/domains/ci-test/workflows/email-daily-summaries/emailRun1/history?format=json'
      );
    });

    it('should allow downloading the full history via export', async function test() {
      const [, scenario, opts] = await historyTest(this.test);
      const exportEl = await scenario.vm.$el.waitUntilExists(
        'section.history .controls a.export'
      );
      const downloadLink = 'javascript:void(0);'; //prevent createing a redirectable link

      chai.spy.on(window.URL, 'createObjectURL', () => downloadLink);
      exportEl.trigger('click');

      await retry(() => {
        window.URL.createObjectURL.should.have.been.called();
        exportEl.should.have.attr('href', downloadLink);
        exportEl.should.have.attr(
          'download',
          'email daily summaries - emailRun1.json'
        );
      });
    });

    describe('Compact View', function describeTest() {
      let prevPollInterval;
      let prevRetryAttempts;

      before(() => {
        prevPollInterval = window.retry.pollInterval;
        prevRetryAttempts = window.retry.retryAttempts;
        window.retry.pollInterval = 20;
        window.retry.retryAttempts = 200;
      });
      after(() => {
        window.retry.pollInterval = prevPollInterval;
        window.retry.retryAttempts = prevRetryAttempts;
      });

      async function compactViewTest(mochaTest) {
        const [summaryEl, scenario] = await historyTest(mochaTest, {
          events: getFixture('history.timelineVariety'),
          query: 'format=compact&graphView=timeline',
          attach: true,
        });

        const timelineEl = await summaryEl.waitUntilExists(
          '.timeline-split div.timeline'
        );

        await retry(() =>
          timelineEl.timeline.fit.should.be.instanceof(Function)
        );

        return [
          timelineEl,
          summaryEl.querySelector('.results .compact-view'),
          scenario,
        ];
      }

      it('should build timeline events from granular event history', async function test() {
        const [, compactViewEl] = await compactViewTest(this.test);

        compactViewEl
          .querySelectorAll('.timeline-event.activity')
          .should.have.length(2);
        compactViewEl
          .querySelectorAll('.timeline-event.activity.completed')
          .should.have.length(1);
        compactViewEl
          .querySelectorAll('.timeline-event.activity.failed')
          .should.have.length(1);
      });

      it('should also populate the timeline with those events', async function test() {
        this.retries(3); // flakey on mocha-chrome but not normal, windowed Chrome
        const [timelineEl] = await compactViewTest(this.test);

        await Promise.delay(50);

        timelineEl.timeline.fit();

        await retry(() =>
          timelineEl
            .querySelectorAll('.vis-box, .vis-range')
            .should.have.length(8)
        );
        timelineEl
          .querySelectorAll('.vis-range.activity')
          .should.have.length(2);
        timelineEl
          .querySelectorAll('.vis-range.activity.completed')
          .should.have.length(1);
        timelineEl
          .querySelectorAll('.vis-range.activity.failed')
          .should.have.length(1);

        timelineEl.querySelectorAll('.vis-box.marker').should.have.length(4);
        timelineEl
          .querySelectorAll('.vis-box.marker.marker-version')
          .should.have.length(1);
        timelineEl
          .querySelectorAll('.vis-box.marker.marker-sideeffect')
          .should.have.length(1);
        timelineEl
          .querySelectorAll('.vis-box.marker.marker-localactivity')
          .should.have.length(2);
      });

      it('should focus the timeline when an event is clicked, updating the URL and zooming in', async function test() {
        const [timelineEl, compactViewEl, scenario] = await compactViewTest(
          this.test
        );

        await Promise.delay(50);

        timelineEl.timeline.fit();
        scenario.location.should.equal(
          '/domains/ci-test/workflows/email-daily-summaries/emailRun1/history?format=compact&graphView=timeline'
        );
        await retry(() =>
          timelineEl
            .querySelectorAll('.vis-range.activity.failed')
            .should.have.length(1)
        );

        timelineEl
          .querySelector('.vis-range.activity.failed')
          .should.not.have.class('vis-selected');
        const failedActivity = await compactViewEl.waitUntilExists(
          '.timeline-event.activity.failed'
        );

        failedActivity.trigger('click');

        await retry(() => {
          scenario.location.should.equal(
            '/domains/ci-test/workflows/email-daily-summaries/emailRun1/history?format=compact&graphView=timeline&eventId=16'
          );
          timelineEl
            .querySelector('.vis-range.activity.failed')
            .should.have.class('vis-selected');
          Number(
            timelineEl
              .querySelector('.vis-range.activity.completed')
              .style.transform.match(/[-0-9]+/)[0]
          ).should.be.below(0);
        });
      });

      // TODO: need to investigate how to trigger the events needed to simulate a click for the timeline - looks like it uses Hammer.js and listens to PointerEvents
      // eslint-disable-next-line jest/no-commented-out-tests
      /*
      it.skip('should scroll the event into view if an event is clicked from the timeline, updating the URL', async function test() {
        const [timelineEl, , scenario] = await compactViewTest(this.test);
        timelineEl.timeline.fit();

        scenario.location.should.equal(
          '/domains/ci-test/workflows/email-daily-summaries/emailRun1/history?format=compact'
        );
        const failedActivity = await timelineEl.waitUntilExists(
          '.vis-range.activity.failed'
        );
        failedActivity.trigger('select');

        await retry(() =>
          scenario.location.should.equal(
            '/domains/ci-test/workflows/email-daily-summaries/emailRun1/history?format=compact&eventId=16'
          )
        );
      });
      */

      it('should show event details when an event is clicked', async function test() {
        const [timelineEl, compactViewEl, scenario] = await compactViewTest(
          this.test
        );

        compactViewEl.querySelectorAll('.selected-event-detail').should.be
          .empty;
        const childWf = await compactViewEl.waitUntilExists(
          '.timeline-event.child-workflow.completed '
        );

        childWf.trigger('click');

        await retry(() => {
          compactViewEl
            .querySelector('.selected-event-detail')
            .should.have.class('active');
          scenario.location.should.equal(
            '/domains/ci-test/workflows/email-daily-summaries/emailRun1/history?format=compact&graphView=timeline&eventId=18'
          );
          timelineEl
            .querySelector('.vis-range.child-workflow.completed')
            .should.have.class('vis-selected');
          compactViewEl
            .querySelector('.timeline-event.child-workflow.completed')
            .should.have.class('vis-selected');
        });
      });

      it('should show event details on initial load, and allow dismissal', async function test() {
        const [summaryEl] = await historyTest(this.test, {
          events: getFixture('history.timelineVariety'),
          query: 'format=compact&eventId=8',
          attach: true,
        });

        await summaryEl.waitUntilExists('.results .compact-view');
        const compactViewEl = summaryEl.querySelector('.results .compact-view');

        await retry(() => {
          compactViewEl
            .querySelector('.selected-event-detail')
            .should.have.class('active');
          compactViewEl
            .querySelector('.timeline-event.marker-sideeffect')
            .should.have.class('vis-selected');
        });
      });
    });

    describe('Grid View', () => {
      async function gridViewTest(mochaTest, o) {
        const [summaryEl, scenario] = await historyTest(mochaTest, {
          query: 'format=grid',
          ...(o || {}),
        });

        return [summaryEl, scenario];
      }
      it('should show full results in a grid', async function test() {
        return gridViewTest(this.test).then(async ([historyEl]) => {
          await historyEl.waitUntilExists(
            '.results .table .vue-recycle-scroller__item-view:nth-child(5) .tr'
          );

          historyEl
            .textNodes('.table .vue-recycle-scroller__item-view .td.col-id')
            .length.should.be.lessThan(12);
          const textNodes = historyEl
            .textNodes('.table .thead .th')
            .slice(0, 2);

          textNodes[0].should.equal('ID');
          textNodes[1].should.include('Type');
          //test id column exists in correct format
          await retry(() =>
            historyEl
              .textNodes('.table .vue-recycle-scroller__item-view .td.col-id')
              .should.deep.equal(
                new Array(6).fill('').map((_, i) => String(i + 1))
              )
          );
          // test time column exists in correct format
          await retry(() =>
            historyEl
              .textNodes('.table .vue-recycle-scroller__item-view .td.col-time')
              .should.deep.equal(
                getFixture('history.emailRun1')
                  .filter((_value, index) => index < 6)
                  .map(e => moment(e.timestamp).format('MMM D, YYYY h:mm:ss A'))
              )
          );
          // test type column exists wirth correct values
          historyEl
            .textNodes('.table .vue-recycle-scroller__item-view .td.col-type')
            .slice(0, 3)
            .should.deep.equal([
              'WorkflowExecutionStarted',
              'DecisionTaskScheduled',
              'DecisionTaskStarted',
            ]);
          // test elapsed time exists with correct values
          historyEl
            .textNodes(
              '.table .vue-recycle-scroller__item-view .td.col-elapsed-time'
            )
            .should.deep.equal([
              moment(getFixture('history.emailRun1')[0].timestamp).format(
                'MMM D, YYYY h:mm:ss A'
              ),
              '',
              '',
              '1s (+1s)',
              '2s (+1s)',
              '3s (+1s)',
            ]);
        });
      });

      it('should show details as flattened key-value pairs from parsed json, except for result and input', async function test() {
        const [historyEl] = await gridViewTest(this.test);
        const startDetails = await historyEl.waitUntilExists(
          '.results .tr:first-child .td:nth-child(5)'
        );
        const inputPreText = JSON.stringify(
          getFixture('history.emailRun1')[0].details.input,
          null,
          2
        );

        startDetails
          .textNodes('dl.details dt')
          .should.deep.equal([
            'cronSchedule',
            'workflowType.name',
            'taskList.name',
            'input',
            'executionStartToCloseTimeout',
            'taskStartToCloseTimeout',
          ]);
        startDetails
          .textNodes('dl.details dd')
          .should.deep.equal([
            '30 * * * *',
            'email-daily-summaries',
            'ci-task-queue',
            inputPreText,
            '6m',
            '3m',
          ]);
      });

      it('should show a full screen view option for large JSON fields, and allow copying it', async function test() {
        const input = {
          foo: 1,
          bar: 'a',
          baz: new Array(100).fill('aa').join('|'),
        };

        const [historyEl, scenario] = await gridViewTest(this.test, {
          attach: true,
          events: [
            {
              eventId: 1,
              eventType: 'WorkflowExecutionStarted',
              details: {
                type: {
                  name: 'ci-input-overflow-test',
                },
                execution: {},
                input,
              },
              timestamp: new Date().toISOString(),
            },
          ],
        });

        const viewFullScreen = await historyEl.waitUntilExists(
          '.results .td:nth-child(5) .data-viewer.overflow a.view-full-screen'
        );

        viewFullScreen.trigger('click');

        const modal = await scenario.vm.$el.waitUntilExists(
          '[data-modal="data-viewer-fullscreen"]'
        );

        await retry(() => {
          modal.should.have
            .descendant('h3')
            .with.text('Event #1 WorkflowExecutionStarted - input');
          modal.should.have
            .descendant('pre.language-json')
            .with.text(JSON.stringify(input, null, 2));
        });

        modal.querySelector('a.copy').trigger('click');
        window.Mocha.copiedText.should.equal(JSON.stringify(input, null, 2));
      });

      it('should allow toggling of the details column between summary and full details', async function test() {
        const [historyEl] = await gridViewTest(this.test);

        await historyEl.waitUntilExists(
          '.results .vue-recycle-scroller__item-view:nth-child(5) .tr'
        );

        const [summaryEl, fullDetailsEl] = historyEl.querySelectorAll(
          '.thead .th:nth-child(5) a'
        );

        summaryEl.should.have.text('Summary').and.have.attr('href', '#');
        fullDetailsEl.should.have
          .text('Full Details')
          .and.not.have.attr('href');

        summaryEl.trigger('click');

        await retry(() => {
          historyEl
            .textNodes(
              '.results .vue-recycle-scroller__item-view:first-child .tr .td.col-summary dl.details dt'
            )
            .should.deep.equal(['Close Timeout', 'input', 'Workflow']);
          const ddTextNodes = historyEl.textNodes(
            '.results .vue-recycle-scroller__item-view:first-child .tr .td.col-summary dl.details dd'
          );

          ddTextNodes[0].should.equal('6m');
          ddTextNodes[1].should.equalIgnoreSpaces(
            JSON.stringify(getFixture('history.emailRun1')[0].details.input)
          );
          ddTextNodes[2].should.equal('email-daily-summaries');
        });
        localStorage
          .getItem('ci-test:history-compact-details')
          .should.equal('true');
      });

      it('should use the details format from local storage if available', async function test() {
        localStorage.setItem('ci-test:history-compact-details', 'true');
        const [historyEl] = await gridViewTest(this.test);

        await retry(() =>
          historyEl
            .textNodes(
              '.results .vue-recycle-scroller__item-view:first-child .tr .td:nth-child(5) dl.details dt'
            )
            .should.deep.equal(['Close Timeout', 'input', 'Workflow'])
        );
      });

      it('should specially handle MarkerRecorded events', async function test() {
        const [historyEl] = await gridViewTest(this.test, {
          events: [
            {
              eventId: 1,
              eventType: 'WorkflowExecutionStarted',
              details: {
                workflowType: {
                  name: 'ci-input-overflow-test',
                },
                execution: {},
              },
              timestamp: new Date().toISOString(),
            },
            {
              eventId: 2,
              eventType: 'MarkerRecorded',
              details: {
                markerName: 'Version',
                details: ['initial version', 0],
              },
              timestamp: new Date().toISOString(),
            },
            {
              eventId: 3,
              eventType: 'MarkerRecorded',
              details: {
                markerName: 'SideEffect',
                details: [0, btoa(JSON.stringify({ foo: 'bar' }))],
              },
              timestamp: new Date().toISOString(),
            },
            {
              eventId: 4,
              eventType: 'MarkerRecorded',
              details: {
                markerName: 'LocalActivity',
                details: {
                  ActivityID: 2,
                  ErrJSON: JSON.stringify({ err: 'in json' }),
                  ErrReason: 'string error reason',
                  ResultJSON: JSON.stringify({ result: 'in json' }),
                },
              },
              timestamp: new Date().toISOString(),
            },
          ],
        });

        await historyEl.waitUntilExists(
          '.results .vue-recycle-scroller__item-view:nth-child(4) .tr'
        );

        historyEl
          .textNodes(
            '.vue-recycle-scroller__item-view:not(:first-child) .tr dl.details dt'
          )
          .should.deep.equal([
            'markerName',
            'details',
            'sideEffectID',
            'data',
            'markerName',
            'details',
          ]);
        historyEl
          .querySelector(
            '.vue-recycle-scroller__item-view:nth-child(3) .tr [data-prop="data"] dd'
          )
          .should.have.trimmed.text(JSON.stringify({ foo: 'bar' }, null, 2));

        historyEl.querySelector('.thead a.summary').trigger('click');
        await Promise.delay(50);

        historyEl
          .textNodes(
            '.vue-recycle-scroller__item-view:not(:first-child) .tr dl.details dt'
          )
          .should.deep.equal([
            'Details',
            'Version',
            'data',
            'Side Effect ID',
            'Local Activity ID',
            'Error',
            'reason',
            'result',
          ]);
        const ddTextNodes = historyEl.textNodes(
          '.vue-recycle-scroller__item-view:not(:first-child) .tr dl.details dd'
        );

        ddTextNodes[0].should.equal('initial version');
        ddTextNodes[1].should.equal('0');
        ddTextNodes[2].should.equalIgnoreSpaces('{"foo":"bar"}');
        ddTextNodes[3].should.equal('0');
        ddTextNodes[4].should.equal('2');
        ddTextNodes[5].should.equalIgnoreSpaces('{"err":"in json"}');
        ddTextNodes[6].should.equal('string error reason');
        ddTextNodes[7].should.equalIgnoreSpaces('{"result":"in json"}');
      });

      it('should render event inputs as highlighted json', async function test() {
        const [historyEl] = await gridViewTest(this.test);
        const startDetails = await historyEl.waitUntilExists(
          '.results .tr:first-child .td:nth-child(5)'
        );
        const inputPreText = JSON.stringify(
          getFixture('history.emailRun1')[0].details.input,
          null,
          2
        );

        startDetails
          .textNodes('dl.details dd pre')
          .should.deep.equal([inputPreText]);
        startDetails
          .textNodes('dl.details dd pre .token')
          .should.have.length(9);
      });

      it('should link to child workflows, and load its history when navigated too', async function test() {
        const [historyEl] = await gridViewTest(this.test, {
          events: [
            {
              eventType: 'WorkflowExecutionStarted',
              timestamp: moment().toISOString(),
              eventId: 1,
              details: {
                workflowType: { name: 'com.github/uber/ci-test-parent' },
              },
            },
            {
              eventId: 1,
              eventType: 'ChildWorkflowExecutionInitiated',
              timestamp: moment().toISOString(),
              details: {
                domain: 'child-domain',
                workflowExecution: {
                  workflowId: 'child-wfid',
                  runId: '2345',
                },
                workflowType: { name: 'some-child-workflow' },
              },
            },
          ],
        });
        const childStartDetails = await historyEl.waitUntilExists(
          '.results .vue-recycle-scroller__item-view:nth-child(1) .tr .td:nth-child(5)'
        );

        childStartDetails
          .querySelector('[data-prop="workflowExecution.runId"] dd a')
          .should.have.text('2345')
          .and.have.attr(
            'href',
            '/domains/child-domain/workflows/child-wfid/2345/summary'
          );
      });
    });
  });

  describe('Stack Trace', () => {
    before(() => {
      MockDate.set(new Date());
    });

    after(() => {
      MockDate.reset();
    });

    it('should also show a stack trace tab for running workflows', async function test() {
      const [, scenario] = await summaryTest(this.test);

      scenario.vm.$el
        .attrValues('section.execution > nav a', 'href')
        .should.deep.equal([
          '/domains/ci-test/workflows/email-daily-summaries/emailRun1/summary',
          '/domains/ci-test/workflows/email-daily-summaries/emailRun1/history',
          '/domains/ci-test/workflows/email-daily-summaries/emailRun1/pending',
          '/domains/ci-test/workflows/email-daily-summaries/emailRun1/stack-trace',
          '/domains/ci-test/workflows/email-daily-summaries/emailRun1/query',
        ]);
      scenario.vm.$el
        .querySelector('section.execution > nav a#nav-link-stack-trace')
        .should.not.have.property('display', 'none');
      scenario.vm.$el
        .querySelector('section.execution > nav a#nav-link-query')
        .should.not.have.property('display', 'none');
    });

    it('should show the current stack trace', async function test() {
      const [scenario] = workflowTest(this.test, {
        view: 'stack-trace',
      });

      scenario
        .withFullHistory()
        .api.postOnce(`${scenario.execApiBase()}/query/__stack_trace`, {
          queryResult: 'goroutine 1:\n\tat foo.go:56',
        });

      const stackTraceTime = moment().format('MMM D, YYYY h:mm:ss A');
      const stackTraceEl = await scenario
        .render()
        .waitUntilExists('section.execution.ready section.stack-trace');

      await retry(() =>
        stackTraceEl
          .querySelector('header span')
          .should.contain.text(`Stack trace at ${stackTraceTime}`)
      );

      stackTraceEl
        .querySelector('pre')
        .should.have.text('goroutine 1:\n\tat foo.go:56');
    });

    it('should allow the user to refresh the stack trace', async function test() {
      const [scenario] = workflowTest(this.test, {
        view: 'stack-trace',
      });
      let called = 0;

      scenario
        .withFullHistory()
        .api.post(`${scenario.execApiBase()}/query/__stack_trace`, () => {
          // eslint-disable-next-line no-plusplus
          if (++called === 1) {
            return { queryResult: 'goroutine 1:\n\tat foo.go:56' };
          }

          if (called === 2) {
            return {
              queryResult:
                'goroutine 1:\n\tat foo.go:56\n\n\tgoroutine 2:\n\tat bar.go:42',
            };
          }

          throw new Error(
            `stack trace query API was called too many times (${called})`
          );
        });

      const stackTraceEl = await scenario
        .render()
        .waitUntilExists('section.execution.ready section.stack-trace');

      await retry(() =>
        stackTraceEl
          .querySelector('pre')
          .should.have.text('goroutine 1:\n\tat foo.go:56')
      );

      stackTraceEl.querySelector('a.refresh').trigger('click');
      await retry(() =>
        stackTraceEl
          .querySelector('pre')
          .should.have.text(
            'goroutine 1:\n\tat foo.go:56\n\n\tgoroutine 2:\n\tat bar.go:42'
          )
      );
    });
  });

  describe('Query', () => {
    async function queryTest(mochaTest, query) {
      const [scenario] = workflowTest(mochaTest, { view: 'query' });

      scenario.withHistory(getFixture('history.emailRun1')).withQuery(query);

      const queryEl = await scenario
        .render()
        .waitUntilExists('section.execution.ready section.query');

      return [queryEl, scenario];
    }

    it('should query the list of stack traces, and show it in the dropdown, enabling run as appropriate', async function test() {
      const [queryEl] = await queryTest(this.test, [
        '__stack_trace',
        'foo',
        'bar',
      ]);

      const queryDropdown = await queryEl.waitUntilExists(
        '.query-name .select-input'
      );
      const options = await queryDropdown.selectOptions();

      options.should.deep.equal(['foo', 'bar']);
    });

    it('should show an error if query could not be listed', async function test() {
      const [queryEl] = await queryTest(this.test, {
        status: 400,
        body: { message: 'I do not understand' },
      });

      await retry(() =>
        queryEl
          .querySelector('span.error')
          .should.have.text('I do not understand')
      );
      queryEl.should.not.contain('header .query-name');
    });

    it('should run a query and show the result', async function test() {
      const [queryEl, scenario] = await queryTest(this.test);

      await queryEl.waitUntilExists('.query-name .select-input');
      const runButton = queryEl.querySelector('a.run');

      await retry(() => runButton.should.have.attr('href', '#'));

      scenario.withQueryResult('status', 'All is good!');
      runButton.trigger('click');
      await retry(() =>
        queryEl.querySelector('pre').should.have.text('All is good!')
      );
    });

    it('should show an error if there was an error running the query', async function test() {
      const [queryEl, scenario] = await queryTest(this.test);

      await queryEl.waitUntilExists('.query-name .select-input');
      const runButton = queryEl.querySelector('a.run');

      await retry(() => runButton.should.have.attr('href', '#'));

      scenario.withQueryResult('status', {
        status: 503,
        body: { message: 'Server Unavailable' },
      });
      runButton.trigger('click');

      await retry(() =>
        queryEl
          .querySelector('span.error')
          .should.have.text('Server Unavailable')
      );
      queryEl.should.not.have.descendant('pre');
    });
  });
});
