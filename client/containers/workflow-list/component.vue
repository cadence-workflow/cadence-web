<script>
// Copyright (c) 2017-2025 Uber Technologies Inc.
// Portions of the Software are attributed to Copyright (c) 2020-2024 Temporal Technologies Inc.
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
import debounce from 'lodash-es/debounce';
import lowerCase from 'lodash-es/lowerCase';
import {
  IS_CRON_LIST,
  FILTER_MODE_ADVANCED,
  STATE_ALL,
  STATE_CLOSED,
  STATE_OPEN,
  STATUS_ALL,
  STATUS_CLOSED,
  STATUS_LIST,
  STATUS_OPEN,
} from './constants';
import {
  getCriteria,
  getFormattedResults,
  getMinStartDate,
  isRangeValid,
  isRouteRangeValid,
} from './helpers';
import {
  ButtonFill,
  DateRangePicker,
  ErrorMessage,
  FeatureFlag,
  FlexGrid,
  FlexGridItem,
  SelectInput,
  TextInput,
  WorkflowGrid,
} from '~components';
import { delay, getEndTimeIsoString, getStartTimeIsoString } from '~helpers';
import { httpService } from '~services';
import { featureFlagService } from '~services';

export default {
  name: 'workflow-list',
  props: [
    'clusterName',
    'dateFormat',
    'domain',
    'fetchWorkflowListUrl',
    'filterBy',
    'filterMode',
    'filterModeButtonEnabled',
    'filterModeButtonLabel',
    'isCron',
    'isCronInputVisible',
    'queryString',
    'state',
    'status',
    'statusName',
    'timeFormat',
    'timezone',
    'workflowId',
    'workflowName',
  ],
  data() {
    return {
      abortController: undefined,
      isCronList: IS_CRON_LIST,
      loading: false,
      results: [],
      error: undefined,
      npt: undefined,
      nptAlt: undefined,
      statusList: STATUS_LIST,
      maxRetentionDays: undefined,
      defaultDateRange: undefined,
      FILTER_MODE_ADVANCED: FILTER_MODE_ADVANCED,
    };
  },
  async created() {
    const defaultDateRange = await featureFlagService.getConfiguration({
      name: 'defaultDateRange',
    });

    this.defaultDateRange = Number(defaultDateRange) || 30;
    await this.fetchDomain();
    this.fetchWorkflowList();
  },
  mounted() {
    this.interval = setInterval(() => {
      this.now = new Date();
    }, 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  components: {
    'button-fill': ButtonFill,
    'date-range-picker': DateRangePicker,
    'error-message': ErrorMessage,
    'feature-flag': FeatureFlag,
    'flex-grid': FlexGrid,
    'flex-grid-item': FlexGridItem,
    'select-input': SelectInput,
    'text-input': TextInput,
    'workflow-grid': WorkflowGrid,
  },
  computed: {
    criteria() {
      const {
        endTime,
        filterMode,
        isCron,
        queryString,
        startTime,
        statusName: status,
        workflowId,
        workflowName,
      } = this;

      return getCriteria({
        endTime,
        filterMode,
        isCron,
        queryString,
        startTime,
        status,
        workflowId,
        workflowName,
      });
    },
    endTime() {
      const { range, endTime } = this.$route.query;

      if (this.range && this.range.endTime) {
        return getEndTimeIsoString(null, this.range.endTime.toISOString());
      }

      return getEndTimeIsoString(range, endTime);
    },
    formattedResults() {
      const { clusterName, dateFormat, results, timeFormat, timezone } = this;

      return getFormattedResults({
        clusterName,
        dateFormat,
        results,
        timeFormat,
        timezone,
      });
    },
    minStartDate() {
      return this.getMinStartDate();
    },
    range() {
      const { defaultDateRange, maxRetentionDays, minStartDate, state } = this;
      const query = this.$route.query || {};

      if (defaultDateRange === undefined) {
        return null;
      }

      if (state === STATE_CLOSED && maxRetentionDays === undefined) {
        return null;
      }

      if (!this.isRouteRangeValid(minStartDate)) {
        const defaultRange = [STATE_ALL, STATE_OPEN].includes(state)
          ? defaultDateRange
          : maxRetentionDays;
        const updatedQuery = this.setRange(
          `last-${Math.min(defaultDateRange, defaultRange)}-days`
        );

        query.startTime = getStartTimeIsoString(
          updatedQuery.range,
          query.startTime
        );
        query.endTime = getEndTimeIsoString(updatedQuery.range, query.endTime);
      }

      return query.startTime && query.endTime
        ? {
            startTime: moment(query.startTime),
            endTime: moment(query.endTime),
          }
        : query.range;
    },
    startTime() {
      const { range, startTime } = this.$route.query;

      if (this.range && this.range.startTime) {
        return getStartTimeIsoString(null, this.range.startTime.toISOString());
      }

      return getStartTimeIsoString(range, startTime);
    },
    noResultsMessageText() {
      const { status, workflowId, workflowName, startTime, endTime } =
        this.$route.query || {};

      if ((status && status !== STATUS_ALL) || workflowId || workflowName) {
        return `No workflows for the selected filters`;
      }

      if (typeof this.range === 'string') {
        return `No workflows within ${lowerCase(this.range)}`;
      }

      if (startTime && endTime) {
        return `No workflows within selected period`;
      }

      return 'No Results';
    },
    crossRegionProps() {
      const { clusterName, domain } = this;

      return { clusterName, domain };
    },
  },
  methods: {
    clearState() {
      this.error = undefined;
      this.loading = false;
      this.npt = undefined;
      this.nptAlt = undefined;
      this.results = [];
    },
    async fetch(url, queryWithStatus) {
      let workflows = [];
      let nextPageToken = '';

      if ([null, ''].includes(queryWithStatus.nextPageToken)) {
        return { workflows, nextPageToken };
      }

      const includeStatus = ![STATUS_ALL, STATUS_OPEN, STATUS_CLOSED].includes(
        queryWithStatus.status
      );
      const { status, ...queryWithoutStatus } = queryWithStatus;
      const query = includeStatus ? queryWithStatus : queryWithoutStatus;

      try {
        if (this.abortController) {
          this.abortController.abort();
          await delay();
        }

        this.error = undefined;
        this.loading = true;

        this.abortController = new AbortController();
        const { signal } = this.abortController;

        const request = await httpService.get(url, {
          query,
          signal,
        });

        this.abortController = undefined;

        workflows = request.executions;

        nextPageToken = request.nextPageToken;
      } catch (error) {
        if (error.name === 'AbortError') {
          return { status: 'aborted' };
        }

        this.error =
          (error.json && error.json.message) || error.status || error.message;

        return { status: 'error' };
      } finally {
        this.loading = false;
      }

      return { status: 'success', workflows, nextPageToken };
    },
    async fetchDomain() {
      const { domain, now } = this;

      this.loading = true;

      try {
        const domainInfo = await httpService.get(`/api/domains/${domain}`);

        this.maxRetentionDays =
          Number(
            domainInfo.configuration.workflowExecutionRetentionPeriodInDays
          ) || 30;
        this.loading = false;

        const minStartDate = this.getMinStartDate();

        if (!this.isRouteRangeValid(minStartDate)) {
          const prevRange = localStorage.getItem(
            `${domain}:workflows-time-range`
          );

          if (
            prevRange &&
            isRangeValid({ minStartDate, now, range: prevRange })
          ) {
            this.setRange(prevRange);
          } else {
            this.setRange(`last-${Math.min(30, this.maxRetentionDays)}-days`);
          }
        }
      } catch (error) {
        this.error =
          (error.json && error.json.message) || error.status || error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchWorkflowList() {
      if (!this.criteria || this.loading) {
        return;
      }

      if (
        this.filterMode === FILTER_MODE_ADVANCED &&
        !this.criteria.queryString
      ) {
        this.clearState();

        return;
      }

      let workflows = [];

      if (
        this.state !== STATE_ALL ||
        this.filterMode === FILTER_MODE_ADVANCED
      ) {
        const query = {
          ...this.criteria,
          nextPageToken: this.npt,
        };

        if (query.queryString) {
          query.queryString = decodeURI(query.queryString);
        } else {
          query.filterBy = this.filterBy;
        }

        const { status, workflows: wfs, nextPageToken } = await this.fetch(
          this.fetchWorkflowListUrl,
          query
        );

        if (status !== 'success') {
          return;
        }

        workflows = wfs;
        this.npt = nextPageToken;
      } else {
        const { domain } = this;
        const queryOpen = {
          ...this.criteria,
          filterBy: this.filterBy,
          nextPageToken: this.npt,
        };
        const queryClosed = {
          ...this.criteria,
          filterBy: this.filterBy,
          nextPageToken: this.nptAlt,
        };

        const {
          status: openStatus,
          workflows: wfsOpen,
          nextPageToken: nptOpen,
        } = await this.fetch(
          `/api/domains/${domain}/workflows/open`,
          queryOpen
        );

        if (openStatus !== 'success') {
          return;
        }

        this.npt = nptOpen;

        const {
          status: closedStatus,
          workflows: wfsClosed,
          nextPageToken: nptClosed,
        } = await this.fetch(
          `/api/domains/${domain}/workflows/closed`,
          queryClosed
        );

        if (closedStatus !== 'success') {
          return;
        }

        this.nptAlt = nptClosed;

        workflows = [...wfsOpen, ...wfsClosed];
      }

      this.results = [...this.results, ...workflows];
    },
    getMinStartDate() {
      const { maxRetentionDays, now, statusName } = this;

      return getMinStartDate({
        maxRetentionDays,
        now,
        statusName,
      });
    },
    isRouteRangeValid(minStartDate) {
      const { now } = this;
      const { endTime, range, startTime } = this.$route.query || {};

      return isRouteRangeValid({
        endTime,
        minStartDate,
        now,
        range,
        startTime,
      });
    },
    refreshWorkflows: debounce(
      function refreshWorkflows() {
        this.clearState();
        this.fetchWorkflowList();
      },
      typeof Mocha === 'undefined' ? 200 : 60,
      { maxWait: 1000 }
    ),
    onFilterChange(event) {
      const target = event.target || event.testTarget; // test hook since Event.target is readOnly and unsettable
      const name = target.getAttribute('name');
      const value = target.value;

      this.$emit('onFilterChange', { [name]: value });
    },
    onIsCronChange(isCron) {
      if (isCron) {
        this.$emit('onFilterChange', { isCron: isCron.value });
      }
    },
    onStatusChange(status) {
      if (status) {
        this.$emit('onFilterChange', { status: status.value });
      }
    },
    onFilterModeClick() {
      this.clearState();
      this.$emit('onFilterModeClick');
    },
    onWorkflowGridScroll(startIndex, endIndex) {
      if (!this.npt && !this.nptAlt) {
        return;
      }

      return this.fetchWorkflowList();
    },
    setRange(range) {
      const query = { ...this.$route.query };

      if (range) {
        if (typeof range === 'string') {
          query.range = range;
          delete query.startTime;
          delete query.endTime;
          localStorage.setItem(`${this.domain}:workflows-time-range`, range);
        } else {
          query.startTime = range.startTime.toISOString();
          query.endTime = range.endTime.toISOString();
          delete query.range;
        }
      } else {
        delete query.range;
        delete query.startTime;
        delete query.endTime;
      }

      this.$router.replace({ query });

      return query;
    },
  },
  watch: {
    criteria(newCriteria, oldCriteria) {
      if (
        newCriteria &&
        oldCriteria &&
        (newCriteria.startTime !== oldCriteria.startTime ||
          newCriteria.endTime !== oldCriteria.endTime ||
          newCriteria.isCron !== oldCriteria.isCron ||
          newCriteria.queryString !== oldCriteria.queryString ||
          newCriteria.status !== oldCriteria.status ||
          newCriteria.workflowId !== oldCriteria.workflowId ||
          newCriteria.workflowName !== oldCriteria.workflowName)
      ) {
        this.refreshWorkflows();
      }
    },
    async crossRegionProps() {
      await this.fetchDomain();
      this.refreshWorkflows();
    },
  },
};
</script>

<template>
  <section class="workflow-list" :class="{ loading, ready: !loading }">
    <header class="filters">
      <template v-if="filterMode === FILTER_MODE_ADVANCED">
        <flex-grid width="100%">
          <flex-grid-item grow="1">
            <text-input
              label="Query"
              type="search"
              name="queryString"
              :value="queryString"
              @input="onFilterChange"
            />
          </flex-grid-item>
          <flex-grid-item>
            <button-fill
              @click="onFilterModeClick"
              disabledLabel="Advanced visibility is not enabled"
              :enabled="filterModeButtonEnabled"
              :label="filterModeButtonLabel"
              uppercase
            />
          </flex-grid-item>
        </flex-grid>
      </template>
      <template v-else>
        <flex-grid width="100%">
          <flex-grid-item grow="1">
            <text-input
              label="Workflow ID"
              type="search"
              name="workflowId"
              :value="workflowId"
              @input="onFilterChange"
            />
          </flex-grid-item>
          <flex-grid-item grow="1">
            <text-input
              label="Workflow Name"
              type="search"
              name="workflowName"
              :value="workflowName"
              @input="onFilterChange"
            />
          </flex-grid-item>
          <flex-grid-item grow="1" width="160px">
            <select-input
              data-cy="status-filter"
              label="Status"
              name="status"
              :options="statusList"
              :value="status"
              @change="onStatusChange"
            />
          </flex-grid-item>
          <feature-flag
            grow="1"
            margin="5px"
            name="workflowListIsCron"
            v-if="isCronInputVisible"
            width="115px"
          >
            <select-input
              label="Cron"
              name="isCron"
              :options="isCronList"
              :value="isCron"
              @change="onIsCronChange"
            />
          </feature-flag>
          <flex-grid-item grow="1" width="105px">
            <text-input
              label="Filter by"
              max-width="100%"
              name="filterBy"
              readonly
              :value="filterBy"
            />
          </flex-grid-item>
          <flex-grid-item>
            <date-range-picker
              :date-range="range"
              :max-days="maxRetentionDays"
              :min-start-date="minStartDate"
              @change="setRange"
            />
          </flex-grid-item>
          <flex-grid-item>
            <button-fill
              @click="onFilterModeClick"
              disabledLabel="Advanced visibility is not enabled"
              :enabled="filterModeButtonEnabled"
              :label="filterModeButtonLabel"
              uppercase
            />
          </flex-grid-item>
        </flex-grid>
      </template>
    </header>
    <error-message :error="error" />
    <workflow-grid
      :workflows="formattedResults"
      :noResultsText="noResultsMessageText"
      :loading="loading"
      @onScroll="onWorkflowGridScroll"
      v-if="!error"
    />
  </section>
</template>

<style lang="stylus">
@require "../../styles/definitions.styl"

section.workflow-list
  display: flex;
  flex-direction: column;
  flex: 1;

  &.loading section.results table
    opacity 0.7
</style>
