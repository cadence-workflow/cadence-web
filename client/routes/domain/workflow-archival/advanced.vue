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
import { LOADING_MESSAGE_DELAY } from './constants';
import WorkflowArchivalService from './workflow-archival-service';
import { mapArchivedWorkflowResponse } from './helpers';
import pagedGrid from '~components/paged-grid';
import {
  ButtonFill,
  ErrorMessage,
  FlexGrid,
  FlexGridItem,
  LoadingSpinner,
  LoadingMessage,
  NoResults,
  TextInput,
} from '~components';
import { getErrorMessage } from '~helpers';

export default pagedGrid({
  name: 'workflow-archival-advanced',
  props: ['clusterName', 'dateFormat', 'domain', 'timeFormat', 'timezone'],
  data() {
    return {
      error: undefined,
      loading: false,
      loadingMessageDelay: LOADING_MESSAGE_DELAY,
      nextPageToken: undefined,
      npt: undefined,
      results: undefined,
    };
  },
  computed: {
    formattedResults() {
      const { dateFormat, results, timeFormat, timezone } = this;

      return mapArchivedWorkflowResponse({
        dateFormat,
        results,
        timeFormat,
        timezone,
      });
    },
    queryString() {
      const { queryString = '' } = this.$route.query || {};

      return queryString;
    },
  },
  created() {
    const { domain, queryString } = this;

    this.workflowArchivalService = WorkflowArchivalService({ domain });
    this.onQueryChange({ queryString });
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
      if (!queryParams || !queryParams.queryString) {
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
        this.npt = undefined;
        this.error = getErrorMessage(error);
      }

      this.loading = false;
    },
    200),
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
      this.setQueryParam(name, value);
    },
    setQueryParam(name, value) {
      this.$router.replaceQueryParam(name, value);
    },
  },
  watch: {
    queryString(queryString) {
      this.onQueryChange({ queryString });
    },
    nextPageToken(nextPageToken) {
      const { queryString } = this;

      if (nextPageToken && queryString) {
        this.onNextTokenChange({ queryString, nextPageToken });
      }
    },
  },
  components: {
    'archival-table': ArchivalTable,
    'archival-table-row': ArchivalTableRow,
    'button-fill': ButtonFill,
    'error-message': ErrorMessage,
    'flex-grid': FlexGrid,
    'flex-grid-item': FlexGridItem,
    'loading-message': LoadingMessage,
    'loading-spinner': LoadingSpinner,
    'no-results': NoResults,
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
            label="Query"
            name="queryString"
            type="search"
            :value="queryString"
            @input="onTextChange"
          />
        </flex-grid-item>
        <flex-grid-item width="85px">
          <button-fill
            label="BASIC"
            tag="router-link"
            :to="{
              name: 'workflow-archival-basic',
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
        <p>Try reducing CloseTime range to improve search time.</p>
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
