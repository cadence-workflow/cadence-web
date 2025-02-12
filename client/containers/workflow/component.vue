<script>
// Copyright (c) 2017-2025 Uber Technologies Inc.
// Portions of the Software are attributed to Copyright (c) 2020-2025 Temporal Technologies Inc.
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

import { RETRY_COUNT_MAX, RETRY_TIMEOUT } from "./constants";
import {
  getHistoryEvents,
  getHistoryTimelineEvents,
  getSummary,
} from "./helpers";
import { NOTIFICATION_TYPE_ERROR } from "~constants";
import { getErrorMessage } from "~helpers";
import { NavigationBar, NavigationLink } from "~components";
import { httpService } from "~services";

export default {
  data() {
    return {
      baseApiUrlRetryCount: 0,
      events: [],
      isWorkflowRunning: undefined,
      nextPageToken: undefined,
      fetchHistoryPageRetryCount: 0,
      wfLoading: true,

      history: {
        loading: undefined,
      },

      summary: {
        input: undefined,
        isWorkflowRunning: undefined,
        parentWorkflowRoute: undefined,
        cronSchedule: undefined,
        result: undefined,
        wfStatus: undefined,
        workflow: undefined,
      },

      taskList: {},

      unwatch: [],
    };
  },
  props: [
    "clusterName",
    "dateFormat",
    "displayWorkflowId",
    "domain",
    "pendingTaskCount",
    "runId",
    "taskListName",
    "timeFormat",
    "timezone",
    "workflow",
    "workflowHistoryEventHighlightList",
    "workflowHistoryEventHighlightListEnabled",
    "workflowId",
  ],
  created() {
    this.unwatch.push(
      this.$watch("baseAPIURL", this.onBaseApiUrlChange, { immediate: true })
    );
    this.unwatch.push(
      this.$watch("historyUrl", this.onHistoryUrlChange, { immediate: true })
    );
  },
  beforeDestroy() {
    this.clearWatches();
  },
  components: {
    "navigation-bar": NavigationBar,
    "navigation-link": NavigationLink,
  },
  computed: {
    baseAPIURL() {
      const { domain, workflowId, runId } = this;

      return `/api/domains/${domain}/workflows/${workflowId}/${runId}`;
    },
    historyEvents() {
      const {
        clusterName,
        dateFormat,
        events,
        timeFormat,
        timezone,
        workflowHistoryEventHighlightList,
        workflowHistoryEventHighlightListEnabled,
      } = this;

      return getHistoryEvents({
        clusterName,
        dateFormat,
        events,
        timeFormat,
        timezone,
        workflowHistoryEventHighlightList,
        workflowHistoryEventHighlightListEnabled,
      });
    },
    historyTimelineEvents() {
      const { clusterName, historyEvents } = this;

      return getHistoryTimelineEvents({ clusterName, historyEvents });
    },
    historyUrl() {
      const historyUrl = `${this.baseAPIURL}/history?waitForNewEvent=true`;

      if (!this.nextPageToken) {
        return historyUrl;
      }

      return `${historyUrl}&nextPageToken=${encodeURIComponent(
        this.nextPageToken
      )}`;
    },
    isWorkerRunning() {
      return this.taskList.pollers && this.taskList.pollers.length > 0;
    },
  },
  methods: {
    clearState() {
      this.events = [];
      this.isWorkflowRunning = undefined;
      this.nextPageToken = undefined;
      this.fetchHistoryPageRetryCount = 0;
      this.wfLoading = true;

      this.history.loading = undefined;

      this.summary.input = undefined;
      this.summary.cronSchedule = undefined;
      this.summary.isWorkflowRunning = undefined;
      this.summary.parentWorkflowRoute = undefined;
      this.summary.result = undefined;
      this.summary.wfStatus = undefined;
      this.summary.workflow = undefined;

      this.$emit("clearWorkflow");
    },
    clearWatches() {
      while (this.unwatch.length) {
        this.unwatch.pop()();
      }
    },
    fetchHistoryPage(pagedHistoryUrl) {
      if (
        this._isDestroyed ||
        !pagedHistoryUrl ||
        this.fetchHistoryPageRetryCount >= RETRY_COUNT_MAX
      ) {
        this.history.loading = false;

        return Promise.resolve();
      }

      this.history.loading = true;

      return httpService
        .get(pagedHistoryUrl)
        .then((res) => {
          // eslint-disable-next-line no-underscore-dangle
          if (this._isDestroyed) {
            return null;
          }

          if (res.nextPageToken && this.nextPageToken === res.nextPageToken) {
            // nothing happened, and same query is still valid, so let's long pool again
            return this.fetchHistoryPage(pagedHistoryUrl);
          }

          if (res.nextPageToken) {
            this.isWorkflowRunning = JSON.parse(
              atob(res.nextPageToken)
            ).IsWorkflowRunning;
            this.nextPageToken = res.nextPageToken;
          } else {
            this.isWorkflowRunning = false;
          }

          const shouldHighlightEventId =
            this.$route.query.eventId &&
            this.events.length <= this.$route.query.eventId;

          const { events } = res.history;

          this.events = this.events.concat(events);

          this.summary = getSummary({
            clusterName: this.clusterName,
            events: this.events,
            isWorkflowRunning: this.isWorkflowRunning,
            workflow: this.workflow,
          });

          if (shouldHighlightEventId) {
            this.$emit("highlight-event-id", this.$route.query.eventId);
          }

          this.fetchHistoryPageRetryCount = 0;

          return this.events;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);

          // eslint-disable-next-line no-underscore-dangle
          if (this._isDestroyed) {
            return;
          }

          this.$emit("onNotification", {
            message: getErrorMessage(error),
            type: NOTIFICATION_TYPE_ERROR,
          });

          this.fetchHistoryPageRetryCount += 1;
          setTimeout(
            () => this.fetchHistoryPage(pagedHistoryUrl),
            RETRY_TIMEOUT
          );
        })
        .finally(() => {
          // eslint-disable-next-line no-underscore-dangle
          if (this._isDestroyed || !this.isWorkflowRunning) {
            this.history.loading = false;
          }
        });
    },
    fetchTaskList() {
      const { taskListName } = this;

      if (!taskListName) {
        return Promise.reject("task list name is required");
      }

      httpService
        .get(
          `/api/domains/${this.$route.params.domain}/task-lists/${taskListName}`
        )
        .then(
          (taskList) => {
            this.taskList = { name: taskListName, ...taskList };
          },
          (error) => {
            this.taskList = { name: taskListName };
            this.error =
              (error.json && error.json.message) ||
              error.status ||
              error.message;
          }
        )
        .finally(() => {
          this.loading = false;
        });
    },
    fetchWorkflowInfo() {
      const { baseAPIURL } = this;

      if (this.baseApiUrlRetryCount >= RETRY_COUNT_MAX) {
        return;
      }

      this.wfLoading = true;

      return httpService
        .get(baseAPIURL)
        .then(
          (wf) => {
            this.$emit("setWorkflow", wf);
            this.isWorkflowRunning = !wf.workflowExecutionInfo.closeTime;
            this.baseApiUrlRetryCount = 0;

            return wf;
          },
          (error) => {
            this.$emit("onNotification", {
              message: getErrorMessage(error),
              type: NOTIFICATION_TYPE_ERROR,
            });
            this.baseApiUrlRetryCount += 1;
            setTimeout(() => this.fetchWorkflowInfo(), RETRY_TIMEOUT);
          }
        )
        .finally(() => {
          this.wfLoading = false;
        });
    },
    onBaseApiUrlChange() {
      this.clearState();
    },
    async onHistoryUrlChange(historyUrl) {
      const workflowInfo = await this.fetchWorkflowInfo();

      if (workflowInfo) {
        await this.fetchHistoryPage(historyUrl);
        this.fetchTaskList();
      }
    },
    onNotification(event) {
      this.$emit("onNotification", event);
    },
    onWorkflowHistoryEventParamToggle(event) {
      this.$emit("onWorkflowHistoryEventParamToggle", event);
    },
  },
};
</script>

<template>
  <section
    class="execution"
    :class="{
      loading:
        wfLoading ||
        (history.loading && (!historyEvents || !historyEvents.length)),
      ready: !wfLoading && !history.loading,
    }"
  >
    <navigation-bar>
      <navigation-link
        id="nav-link-summary"
        icon="icon_receipt"
        label="Summary"
        :to="{
          name: 'workflow/summary',
          params: { clusterName },
        }"
        data-cy="summary-link"
      />
      <navigation-link
        id="nav-link-history"
        icon="icon_trip-history"
        label="History"
        :to="{
          name: 'workflow/history',
          params: { clusterName },
        }"
        data-cy="history-link"
      />
      <navigation-link
        id="nav-link-pending"
        icon="icon_send"
        label="Pending"
        :notification-count="pendingTaskCount"
        :to="{
          name: 'workflow/pending',
          params: { clusterName },
        }"
        data-cy="pending-link"
      />
      <navigation-link
        id="nav-link-stack-trace"
        icon="icon_trips"
        label="Stack Trace"
        :to="{
          name: 'workflow/stack-trace',
          params: { clusterName },
        }"
        data-cy="stack-trace-link"
      />
      <navigation-link
        id="nav-link-query"
        icon="icon_lost"
        label="Query"
        :to="{
          name: 'workflow/query',
          params: { clusterName },
        }"
        data-cy="query-link"
      />
    </navigation-bar>
    <router-view
      name="summary"
      :baseAPIURL="baseAPIURL"
      :date-format="dateFormat"
      :display-workflow-id="displayWorkflowId"
      :domain="domain"
      :input="summary.input"
      :cronSchedule="summary.cronSchedule"
      :isWorkflowRunning="summary.isWorkflowRunning"
      :parentWorkflowRoute="summary.parentWorkflowRoute"
      :result="summary.result"
      :time-format="timeFormat"
      :timezone="timezone"
      :wfStatus="summary.wfStatus"
      :workflow="summary.workflow"
      @onNotification="onNotification"
    />
    <router-view
      name="history"
      :baseAPIURL="baseAPIURL"
      :events="historyEvents"
      :isWorkflowRunning="isWorkflowRunning"
      :loading="history.loading"
      :timelineEvents="historyTimelineEvents"
      :workflow-history-event-highlight-list="workflowHistoryEventHighlightList"
      :workflow-history-event-highlight-list-enabled="
        workflowHistoryEventHighlightListEnabled
      "
      @onNotification="onNotification"
      @onWorkflowHistoryEventParamToggle="onWorkflowHistoryEventParamToggle"
    />
    <router-view
      name="pending"
      :baseAPIURL="baseAPIURL"
      :time-format="timeFormat"
      :timezone="timezone"
    />
    <router-view
      name="stacktrace"
      :baseAPIURL="baseAPIURL"
      :date-format="dateFormat"
      :isWorkerRunning="isWorkerRunning"
      :taskListName="taskList.name"
      :time-format="timeFormat"
      :timezone="timezone"
      @onNotification="onNotification"
    />
    <router-view
      name="query"
      :baseAPIURL="baseAPIURL"
      :isWorkerRunning="isWorkerRunning"
      :taskListName="taskList.name"
      @onNotification="onNotification"
    />
  </section>
</template>
