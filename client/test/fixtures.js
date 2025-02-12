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

const timeBasis = moment()
  .startOf('day')
  .add(5, 'hours');
const emailRun1Start = moment(timeBasis)
  .subtract(3, 'minutes')
  .subtract(1, 'day');
const exampleTimeoutStart = moment(timeBasis).subtract(2, 'hours');
const timelineVarietyStart = moment(timeBasis).subtract(5, 'hours');

export default {
  cluster: {
    supportedClientVersions: { goSdk: '1.7.0', javaSdk: '1.4.0' },
    membershipInfo: null,
    persistenceInfo: {
      historyStore: { backend: 'cassandra', settings: null, features: null },
      visibilityStore: {
        backend: 'elasticsearch',
        settings: null,
        features: [{ key: 'advancedVisibilityEnabled', enabled: true }],
      },
    },
  },
  domainSearch: [
    {
      domainInfo: {
        name: 'ci-tests',
        status: 'REGISTERED',
        description: '',
        ownerEmail: '',
        data: {},
        uuid: '1',
      },
      configuration: {
        workflowExecutionRetentionPeriodInDays: 7,
        emitMetric: true,
        badBinaries: { binaries: {} },
        historyArchivalStatus: 'DISABLED',
        historyArchivalURI: '',
        visibilityArchivalStatus: 'DISABLED',
        visibilityArchivalURI: '',
      },
      replicationConfiguration: {
        activeClusterName: 'primary',
        clusters: [{ clusterName: 'primary' }],
      },
      failoverVersion: -24,
      isGlobalDomain: false,
    },
  ],
  featureFlags: [
    {
      key: 'crossRegion',
      value: false,
    },
    {
      key: 'defaultDateRange',
      value: 30,
    },
    {
      key: 'domainAuthorization',
      value: false,
    },
    {
      key: 'domainAutocomplete',
      value: true,
    },
    {
      key: 'domainMetrics',
      value: false,
    },
    {
      key: 'environmentSelect',
      value: false,
    },
    {
      key: 'taskListMetrics',
      value: false,
    },
    {
      key: 'taskListPartition',
      value: false,
    },
    {
      key: 'workflowGraph',
      value: true,
    },
    {
      key: 'workflowListIsCron',
      value: true,
    },
    {
      key: 'workflowTerminate',
      value: true,
    },
  ],
  history: {
    emailRun1: [
      {
        timestamp: emailRun1Start.toISOString(),
        eventType: 'WorkflowExecutionStarted',
        eventId: 1,
        details: {
          cronSchedule: '30 * * * *',
          workflowType: {
            name: 'email-daily-summaries',
          },
          taskList: {
            name: 'ci-task-queue',
          },
          input: [839134, { env: 'prod' }],
          executionStartToCloseTimeoutSeconds: 360,
          taskStartToCloseTimeoutSeconds: 180,
        },
      },
      {
        timestamp: emailRun1Start.toISOString(),
        eventType: 'DecisionTaskScheduled',
        eventId: 2,
        details: {
          taskList: {
            name: 'ci-task-queue',
          },
          zero: 0,
        },
      },
      {
        timestamp: emailRun1Start.toISOString(),
        eventType: 'DecisionTaskStarted',
        eventId: 3,
        details: {
          scheduledEventId: 2,
          question: 'What is the answer to life, the universe, and everything?',
          requestId: 'abefc8d3-c654-49e6-8e17-126847bf315f',
        },
      },
      {
        timestamp: emailRun1Start.add(1, 'second').toISOString(),
        eventType: 'DecisionTaskCompleted',
        eventId: 4,
        details: {
          scheduledEventId: 2,
          startedEventId: 3,
          answer: 42,
        },
      },
      {
        timestamp: emailRun1Start.add(1, 'second').toISOString(),
        eventType: 'MarkerRecorded',
        eventId: 5,
        details: {
          markerName: 'Version',
          details: [0, 'initial version'],
          decisionTaskCompletedEventId: 4,
        },
      },
      {
        timestamp: emailRun1Start.add(1, 'second').toISOString(),
        eventType: 'ActivityTaskScheduled',
        eventId: 6,
        details: {
          activityId: '0',
          activityType: {
            name: 'send-emails',
          },
          taskList: {
            name: 'ci-task-queue',
          },
          input: [12345, ['bob@example.com', 'jane@somewhere.com']],
          scheduleToCloseTimeoutSeconds: 360,
          scheduleToStartTimeoutSeconds: 180,
          startToCloseTimeoutSeconds: 180,
          heartbeatTimeoutSeconds: 0,
          decisionTaskCompletedEventId: 4,
        },
      },
      {
        timestamp: emailRun1Start.add(5, 'second').toISOString(),
        eventType: 'ActivityTaskStarted',
        eventId: 7,
        details: {
          scheduledEventId: 6,
          requestId: '13624219-683c-401e-a321-db04cdac724a',
        },
      },
      {
        timestamp: emailRun1Start.add(11, 'second').toISOString(),
        eventType: 'ActivityTaskCompleted',
        eventId: 8,
        details: {
          result:
            '{IntVal:9223372036854775807,IntPtrVal:9223372036854775807,FloatVal:1.7976931348623157e+308,StringVal:canary_echo_test,StringPtrVal:canary_echo_test,SliceVal:[canary,.,echoWorkflow],MapVal:{us-east-1:dca1a,us-west-1:sjc1a}}',
          scheduledEventId: 6,
          startedEventId: 7,
        },
      },
      {
        timestamp: emailRun1Start.add(11, 'second').toISOString(),
        eventType: 'DecisionTaskScheduled',
        eventId: 9,
        details: { taskList: { name: 'ci-task-queue' } },
      },
      {
        timestamp: emailRun1Start.add(11, 'second').toISOString(),
        eventType: 'DecisionTaskStarted',
        eventId: 10,
        details: {
          scheduledEventId: 9,
          foo: 'bar',
        },
      },
      {
        timestamp: emailRun1Start.add(11, 'second').toISOString(),
        eventType: 'DecisionTaskCompleted',
        eventId: 11,
        details: {
          scheduledEventId: 9,
          startedEventId: 10,
        },
      },
      {
        timestamp: emailRun1Start.add(12, 'second').toISOString(),
        eventType: 'WorkflowExecutionCompleted',
        eventId: 12,
        details: {
          result: {
            recipients: ['bob@example.com', 'jane@example.com'],
            trackingTag: 'foobarbaz',
          },
          decisionTaskCompletedEventId: 11,
        },
      },
    ],
    exampleTimeout: [
      {
        details: {
          executionStartToCloseTimeoutSeconds: 360,
          taskList: {
            name: 'canary-task-queue',
          },
          taskStartToCloseTimeoutSeconds: 180,
          workflowType: {
            name: 'example',
          },
        },
        eventId: 1,
        eventType: 'WorkflowExecutionStarted',
        timestamp: exampleTimeoutStart.toISOString(),
      },
      {
        eventId: 2,
        eventType: 'DecisionTaskScheduled',
        timestamp: exampleTimeoutStart.toISOString(),
      },
      {
        details: {
          scheduledEventId: 2,
        },
        eventId: 3,
        eventType: 'DecisionTaskStarted',
        timestamp: exampleTimeoutStart.toISOString(),
      },
      {
        details: {
          scheduledEventId: 2,
          startedEventId: 3,
        },
        eventId: 4,
        eventType: 'DecisionTaskCompleted',
        timestamp: exampleTimeoutStart.toISOString(),
      },
      {
        details: {
          decisionTaskCompletedEventId: 4,
        },
        eventId: 5,
        eventType: 'MarkerRecorded',
        timestamp: exampleTimeoutStart.toISOString(),
      },
      {
        details: {
          activityId: 0,
          activityType: {
            name: 'activity.timeout',
          },
          decisionTaskCompletedEventId: 4,
          heartbeatTimeoutSeconds: 0,
          scheduleToCloseTimeoutSeconds: 2,
          scheduleToStartTimeoutSeconds: 1,
          startToCloseTimeoutSeconds: 1,
          taskList: {
            name: 'ci-task-queue',
          },
        },
        eventId: 6,
        eventType: 'ActivityTaskScheduled',
        timestamp: exampleTimeoutStart.add(1, 'second').toISOString(),
      },
      {
        details: {
          requestId: '71e3bef1-d6db-4ce1-b705-cf81732a6faf',
          scheduledEventId: 6,
        },
        eventId: 7,
        eventType: 'ActivityTaskStarted',
        timestamp: exampleTimeoutStart.add(1, 'second').toISOString(),
      },
      {
        details: {
          scheduledEventId: 6,
          startedEventId: 7,
          timeoutType: 'START_TO_CLOSE',
        },
        eventId: 8,
        eventType: 'ActivityTaskTimedOut',
        timestamp: exampleTimeoutStart.add(2, 'second').toISOString(),
      },
      {
        details: {
          startToCloseTimeoutSeconds: 180,
          taskList: {
            name: 'compute3330-sjc1:43b62b8e-aa2a-4b58-9571-39062a073d24',
          },
        },
        eventId: 9,
        eventType: 'DecisionTaskScheduled',
        timestamp: exampleTimeoutStart.add(2, 'second').toISOString(),
      },
      {
        details: {
          scheduledEventId: 9,
        },
        eventId: 10,
        eventType: 'DecisionTaskStarted',
        timestamp: exampleTimeoutStart.add(2, 'second').toISOString(),
      },
      {
        details: {
          executionContext: null,
          scheduledEventId: 9,
          startedEventId: 10,
        },
        eventId: 11,
        eventType: 'DecisionTaskCompleted',
        timestamp: exampleTimeoutStart.add(2, 'second').toISOString(),
      },
      {
        details: {
          reason: 'activityTimeout',
          activityId: 0,
        },
        eventId: 12,
        eventType: 'WorkflowExecutionCompleted',
        timestamp: exampleTimeoutStart.add(2, 'second').toISOString(),
      },
    ],
    timelineVariety: [
      {
        timestamp: timelineVarietyStart.toISOString(),
        eventType: 'WorkflowExecutionStarted',
        eventId: 1,
        details: {
          workflowType: {
            name: 'email-daily-summaries',
          },
          taskList: {
            name: 'ci-task-queue',
          },
          input: [839134, { env: 'prod' }],
          executionStartToCloseTimeoutSeconds: 360,
          taskStartToCloseTimeoutSeconds: 180,
        },
      },
      {
        timestamp: timelineVarietyStart.toISOString(),
        eventType: 'DecisionTaskScheduled',
        eventId: 2,
        details: {
          taskList: {
            name: 'ci-task-queue',
          },
          zero: 0,
        },
      },
      {
        timestamp: timelineVarietyStart.toISOString(),
        eventType: 'DecisionTaskStarted',
        eventId: 3,
        details: {
          scheduledEventId: 2,
          question: 'What is the answer to life, the universe, and everything?',
          requestId: 'abefc8d3-c654-49e6-8e17-126847bf315f',
        },
      },
      {
        timestamp: timelineVarietyStart.add(1, 'second').toISOString(),
        eventType: 'DecisionTaskCompleted',
        eventId: 4,
        details: {
          scheduledEventId: 2,
          startedEventId: 3,
          answer: 42,
        },
      },
      {
        timestamp: timelineVarietyStart.add(1, 'second').toISOString(),
        eventType: 'MarkerRecorded',
        eventId: 5,
        details: {
          markerName: 'Version',
          details: [0, 'initial version'],
          decisionTaskCompletedEventId: 4,
        },
      },
      {
        timestamp: timelineVarietyStart.add(1, 'second').toISOString(),
        eventType: 'ActivityTaskScheduled',
        eventId: 6,
        details: {
          activityId: 0,
          activityType: {
            name: 'search-for-treasure',
          },
          taskList: {
            name: 'ci-task-queue',
          },
          input: { location: 'volcanic island' },
          scheduleToCloseTimeoutSeconds: 360,
          scheduleToStartTimeoutSeconds: 180,
          startToCloseTimeoutSeconds: 180,
          heartbeatTimeoutSeconds: 0,
          decisionTaskCompletedEventId: 4,
        },
      },
      {
        timestamp: timelineVarietyStart.add(5, 'second').toISOString(),
        eventType: 'ActivityTaskStarted',
        eventId: 7,
        details: {
          scheduledEventId: 6,
          requestId: '13624219-683c-401e-a321-db04cdac724a',
        },
      },
      {
        timestamp: timelineVarietyStart.add(1, 'second').toISOString(),
        eventType: 'MarkerRecorded',
        eventId: 8,
        details: {
          markerName: 'SideEffect',
          details: [0, btoa(JSON.stringify({ foo: 'bar' }))],
        },
      },
      {
        timestamp: timelineVarietyStart.add(11, 'second').toISOString(),
        eventType: 'ActivityTaskCompleted',
        eventId: 9,
        details: {
          result: 'no treasure',
          scheduledEventId: 6,
          startedEventId: 7,
        },
      },
      {
        timestamp: timelineVarietyStart.add(11, 'second').toISOString(),
        eventType: 'StartChildWorkflowExecutionInitiated',
        eventId: 10,
        details: {
          workflowType: { name: 'sail-the-ocean' },
          taskList: { name: 'another-queue' },
          input: { direction: 'west' },
        },
      },
      {
        timestamp: timelineVarietyStart.add(11, 'second').toISOString(),
        eventType: 'ChildWorkflowExecutionStarted',
        eventId: 11,
        details: {
          domain: 'pirates',
          workflowType: { name: 'sail-the-ocean' },
          workflowExecution: {
            workflowId: 'sail-the-ocean-1',
            runId: 'arrr56',
          },
          initiatedEventId: 10,
        },
      },
      {
        timestamp: timelineVarietyStart.add(11, 'second').toISOString(),
        eventType: 'ActivityTaskScheduled',
        eventId: 12,
        details: {
          activityId: 1,
          activityType: {
            name: 'swab-the-deck',
          },
          taskList: {
            name: 'ci-task-queue',
          },
          input: { moveTheGrogToo: true },
          scheduleToCloseTimeoutSeconds: 3600,
          scheduleToStartTimeoutSeconds: 180,
          startToCloseTimeoutSeconds: 3780,
          heartbeatTimeoutSeconds: 0,
        },
      },
      {
        timestamp: timelineVarietyStart.add(12, 'second').toISOString(),
        eventType: 'ActivityTaskStarted',
        eventId: 13,
        details: {
          scheduledEventId: 12,
          attempt: 1,
          requestId: 'e44b387b-7315-4238-93c5-dc0e1e67f317',
        },
      },
      {
        timestamp: timelineVarietyStart.add(13, 'second').toISOString(),
        eventType: 'MarkerRecorded',
        eventId: 14,
        details: {
          markerName: 'LocalActivity',
          details: {
            ActivityID: 1,
            ErrReason: 'child process failed',
            ErrJSON: JSON.stringify({ exitcode: 1 }),
          },
        },
      },
      {
        timestamp: timelineVarietyStart.add(15, 'second').toISOString(),
        eventType: 'MarkerRecorded',
        eventId: 15,
        details: {
          markerName: 'LocalActivity',
          details: {
            ActivityID: 2,
            ResultJSON: JSON.stringify({ parrot_name: 'squaky' }),
          },
        },
      },
      {
        timestamp: timelineVarietyStart
          .add(1, 'minute')
          .add(2, 'second')
          .toISOString(),
        eventType: 'ActivityTaskFailed',
        eventId: 16,
        details: {
          reason: "couldn't find the mop",
          details: { pirate_name: 'McShorty' },
          scheduledEventId: 12,
          startedEventId: 13,
        },
      },
      {
        timestamp: timelineVarietyStart
          .add(1, 'minute')
          .add(20, 'second')
          .toISOString(),
        eventType: 'WorkflowExecutionSignaled',
        eventId: 17,
        details: {
          input: {
            message: 'enemy ship spotted!',
            position: "7 o'clock",
          },
        },
      },
      {
        timestamp: timelineVarietyStart
          .add(2, 'minute')
          .add(10, 'seconds')
          .toISOString(),
        eventType: 'ChildWorkflowExecutionCompleted',
        eventId: 18,
        details: {
          workflowType: { name: 'sail-the-ocean' },
          workflowExecution: {
            workflowId: 'sail-the-ocean-1',
            runId: 'arrr56',
          },
          result: {
            treasure: false,
            notes: 'enemies abound!',
          },
          initiatedEventId: 10,
        },
      },
      {
        timestamp: timelineVarietyStart
          .add(2, 'minute')
          .add(10, 'seconds')
          .toISOString(),
        eventType: 'WorkflowExecutionCompleted',
        eventId: 19,
        details: {
          result: {
            recipients: ['bob@example.com', 'jane@example.com'],
            trackingTag: 'foobarbaz',
          },
          decisionTaskCompletedEventId: 11,
        },
      },
    ],
  },
  newsFeed: {
    simple: {
      version: 'https://jsonfeed.org/version/1',
      title: '',
      home_page_url: '/',
      feed_url: '/feed.json',
      items: [
        {
          id: '/_news/2019/05/05/writing-a-vuepress-theme-2/',
          url: '/_news/2019/05/05/writing-a-vuepress-theme-2/',
          title: 'Writing a VuePress theme',
          summary: 'To write a theme, create a .vuepress/theme directory ...',
          date_modified: '2019-05-06T00:00:00.000Z',
        },
        {
          id: '/_news/2019/02/25/markdown-slot-3/',
          url: '/_news/2019/02/25/markdown-slot-3/',
          title: 'Markdown Slot',
          summary:
            'VuePress implements a content distribution API for Markdown...',
          date_modified: '2019-02-26T00:00:00.000Z',
        },
      ],
    },
    empty: {
      version: 'https://jsonfeed.org/version/1',
      title: '',
      home_page_url: '/',
      feed_url: '/feed.json',
      items: [],
    },
  },
  timeBasis,
  workflows: {
    open: [
      {
        domainName: 'ci-test',
        execution: {
          workflowId: 'github.com/uber/cadence-web/email-daily-summaries-2',
          runId: 'ef2c889e-e709-4d50-99ee-3748dfa0a101',
        },
        type: {
          name: 'email-daily-summaries',
        },
        startTime: moment(timeBasis)
          .subtract(3, 'minutes')
          .toISOString(),
      },
      {
        domainName: 'ci-test',
        execution: {
          workflowId: 'github.com/uber/cadence-web/example-1',
          runId: 'db8da3c0-b7d3-48b7-a9b3-b6f566e58207',
        },
        type: {
          name: 'example',
        },
        startTime: moment(timeBasis)
          .subtract(20, 'seconds')
          .toISOString(),
      },
    ],
    closed: [
      {
        domainName: 'ci-test',
        execution: {
          workflowId: 'email-daily-summaries',
          runId: '51ccc0d1-6ffe-4a7a-a89f-6b5154df86f7',
        },
        type: {
          name: 'github.com/uber/cadence-web/email-daily-summaries-1',
        },
        closeStatus: 'COMPLETED',
        startTime: emailRun1Start.toISOString(),
        closeTime: moment(timeBasis)
          .subtract(2, 'minutes')
          .subtract(1, 'day')
          .toISOString(),
      },
    ],
    list: [
      {
        domainName: 'ci-test',
        execution: {
          workflowId: 'email-daily-summaries',
          runId: '51ccc0d1-6ffe-4a7a-a89f-6b5154df86f7',
        },
        type: {
          name: 'github.com/uber/cadence-web/email-daily-summaries-1',
        },
        closeStatus: 'COMPLETED',
        startTime: emailRun1Start.toISOString(),
        closeTime: moment(timeBasis)
          .subtract(2, 'minutes')
          .subtract(1, 'day')
          .toISOString(),
      },
    ],
  },
};
