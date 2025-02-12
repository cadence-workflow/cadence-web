<script>
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

import debounce from 'lodash-es/debounce';
import { ArchivalTable, ArchivalTableRow } from './components';
import { ARCHIVAL_STATUS_LIST, LOADING_MESSAGE_DELAY } from './constants';
import {
  getQueryParams,
  getRange,
  getStatus,
  getStatusValue,
  updateQueryFromRange,
  mapArchivedWorkflowResponse,
} from './helpers';
import WorkflowArchivalService from './workflow-archival-service';
import pagedGrid from '~components/paged-grid';
import {
  ButtonFill,
  DateRangePicker,
  ErrorMessage,
  FlexGrid,
  FlexGridItem,
  LoadingMessage,
  LoadingSpinner,
  NoResults,
  SelectInput,
  TextInput,
} from '~components';
import {
  getEndTimeIsoString,
  getErrorMessage,
  getStartTimeIsoString,
} from '~helpers';

export default pagedGrid({
  name: 'workflow-archival-basic',
  props: ['clusterName', 'dateFormat', 'domain', 'timeFormat', 'timezone'],
  data() {
    return {
      error: undefined,
      filterBy: 'CloseTime',
      loading: false,
      loadingMessageDelay: LOADING_MESSAGE_DELAY,
      nextPageToken: undefined,
      npt: undefined,
      results: undefined,
      statusList: ARCHIVAL_STATUS_LIST,
    };
  },
  computed: {
    endTime() {
      const { range } = this;
      const { endTime } = this.$route.query || {};

      return getEndTimeIsoString(range, endTime);
    },
    formattedResults() {
      const { dateFormat, results, timeFormat, timezone } = this;

      return mapArchivedWorkflowResponse({
        dateFormat,
        results,
        timeFormat,
        timezone,
      });
    },
    queryParams() {
      const {
        endTime,
        workflowName,
        statusValue,
        startTime,
        workflowId,
      } = this;

      return getQueryParams({
        endTime,
        workflowName,
        statusValue,
        startTime,
        workflowId,
      });
    },
    range() {
      const { endTime, range, startTime } = this.$route.query || {};

      return getRange({ endTime, range, startTime });
    },
    workflowName() {
      const { workflowName = '' } = this.$route.query || {};

      return workflowName;
    },
    status() {
      const statusValue = this.$route.query && this.$route.query.status;
      const { statusList } = this;

      return getStatus({ statusList, statusValue });
    },
    statusValue() {
      const { status, statusList } = this;

      return getStatusValue({ status, statusList });
    },
    startTime() {
      const { range } = this;
      const { startTime } = this.$route.query || {};

      return getStartTimeIsoString(range, startTime);
    },
    workflowId() {
      const { workflowId = '' } = this.$route.query || {};

      return workflowId;
    },
  },
  created() {
    const { domain, queryParams } = this;

    this.workflowArchivalService = WorkflowArchivalService({ domain });
    this.onQueryChange({ ...queryParams, nextPageToken: undefined });
  },
  methods: {
    resetState() {
      this.error = undefined;
      this.loading = false;
      this.results = undefined;
      this.npt = undefined;
      this.nextPageToken = undefined;
    },
    fetchArchivalRecord: debounce(async function fetchArchivalRecord(
      queryParams
    ) {
      if (!queryParams || !queryParams.startTime || !queryParams.endTime) {
        return;
      }

      this.loading = true;

      try {
        const {
          results,
          nextPageToken,
        } = await this.workflowArchivalService.fetchArchivalRecords(
          queryParams
        );

        this.results = this.results ? this.results.concat(results) : results;

        this.npt = nextPageToken;
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        this.npt = undefined;
        this.error = getErrorMessage(error);
      }

      this.loading = false;
    },
    200),
    onDateRangeChange(updatedRange) {
      const { query } = this.$route;
      const updatedQuery = updateQueryFromRange({ query, updatedRange });

      this.$router.replace({ query: updatedQuery });
    },
    onQueryChange(queryParams) {
      this.resetState();

      if (queryParams) {
        this.fetchArchivalRecord({ ...queryParams, nextPageToken: undefined });
      }
    },
    onNextTokenChange(queryParams) {
      this.fetchArchivalRecord(queryParams);
    },
    onTextChange({ target: { name, value } }) {
      this.setQueryParam(name, value.trim());
    },
    onSelectChange({ value }) {
      this.setQueryParam('status', value);
    },
    setQueryParam(name, value) {
      this.$router.replaceQueryParam(name, value);
    },
  },
  watch: {
    queryParams(queryParams) {
      this.onQueryChange(queryParams);
    },
    nextPageToken(nextPageToken) {
      const { queryParams } = this;

      if (nextPageToken && queryParams) {
        this.onNextTokenChange({ ...queryParams, nextPageToken });
      }
    },
  },
  components: {
    'archival-table': ArchivalTable,
    'archival-table-row': ArchivalTableRow,
    'button-fill': ButtonFill,
    'date-range-picker': DateRangePicker,
    'error-message': ErrorMessage,
    'flex-grid': FlexGrid,
    'flex-grid-item': FlexGridItem,
    'loading-message': LoadingMessage,
    'loading-spinner': LoadingSpinner,
    'no-results': NoResults,
    'select-input': SelectInput,
    'text-input': TextInput,
  },
});
</script>

<template>
  <section class="workflow-archival-basic">
    <header>
      <flex-grid>
        <flex-grid-item grow="1">
          <text-input
            label="Workflow ID"
            name="workflowId"
            type="search"
            :value="workflowId"
            @input="onTextChange"
          />
        </flex-grid-item>
        <flex-grid-item grow="1">
          <text-input
            label="Workflow Name"
            name="workflowName"
            type="search"
            :value="workflowName"
            @input="onTextChange"
          />
        </flex-grid-item>
        <flex-grid-item width="160px">
          <select-input
            label="Status"
            :options="statusList"
            :value="status"
            @change="onSelectChange"
          />
        </flex-grid-item>
        <flex-grid-item width="165px">
          <text-input label="Filter by" readonly :value="filterBy" />
        </flex-grid-item>
        <flex-grid-item width="325px">
          <date-range-picker :date-range="range" @change="onDateRangeChange" />
        </flex-grid-item>
        <flex-grid-item width="120px">
          <button-fill
            label="ADVANCED"
            tag="router-link"
            :to="{
              name: 'workflow-archival-advanced',
              params: { clusterName },
            }"
          />
        </flex-grid-item>
      </flex-grid>
    </header>
    <section class="results">
      <archival-table
        v-infinite-scroll="nextPage"
        infinite-scroll-disabled="disableInfiniteScroll"
        infinite-scroll-distance="20"
        infinite-scroll-immediate-check="false"
      >
        <archival-table-row
          v-for="result in formattedResults"
          :close-status="result.closeStatus"
          :close-time="result.closeTime"
          :cluster-name="clusterName"
          :domain-name="result.domainName"
          :key="result.runId"
          :run-id="result.runId"
          :start-time="result.startTime"
          :workflow-id="result.workflowId"
          :workflow-name="result.workflowName"
        />
      </archival-table>
      <error-message :error="error" />
      <no-results :results="results" />
      <loading-spinner v-if="loading" />
      <loading-message :delay="loadingMessageDelay" :loading="loading">
        <p>It looks like this request is taking some time to process.</p>
        <p>Try narrowing the time range to improve search time.</p>
      </loading-message>
    </section>
  </section>
</template>

<style lang="stylus">
section.workflow-archival-basic {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  overflow-y: auto;

  header {
    padding: 16px;
  }

  section.results {
    margin-top: 16px;
    min-height: 100px;
    overflow: auto;
  }

  paged-grid();
}
</style>
