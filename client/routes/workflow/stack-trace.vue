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

import { getQueryResult } from './helpers';
import { getDatetimeFormattedString } from '~helpers';
import { httpService } from '~services';

export default {
  data() {
    return {
      loading: undefined,
      stackTrace: undefined,
      stackTraceTimestamp: undefined,
    };
  },
  props: [
    'baseAPIURL',
    'clusterName',
    'dateFormat',
    'isWorkerRunning',
    'taskListName',
    'timeFormat',
    'timezone',
  ],
  computed: {
    formattedStackTraceTimestamp() {
      const { dateFormat, stackTraceTimestamp, timeFormat, timezone } = this;

      return stackTraceTimestamp
        ? getDatetimeFormattedString({
            date: stackTraceTimestamp,
            dateFormat,
            timeFormat,
            timezone,
          })
        : '';
    },
  },
  created() {
    if (!this.isWorkerRunning) {
      return;
    }

    this.getStackTrace();
  },
  methods: {
    getStackTrace() {
      this.loading = true;

      return httpService
        .post(`${this.baseAPIURL}/query/__stack_trace`)
        .then(({ queryResult }) => {
          this.stackTrace = getQueryResult(queryResult);
          this.stackTraceTimestamp = new Date();
        })
        .catch(e => {
          // eslint-disable-next-line no-console
          console.error(e);
          this.stackTrace = {
            error: (e.json && e.json.message) || e.status || e.message,
          };
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  watch: {
    isWorkerRunning: function(newVal, oldVal) {
      if (newVal == false) {
        this.queries = [];

        return;
      }

      this.getStackTrace();
    },
  },
};
</script>

<template>
  <section :class="{ 'stack-trace': true, loading }" data-cy="stack-trace">
    <header v-if="stackTraceTimestamp">
      <span>Stack trace at {{ formattedStackTraceTimestamp }}</span>
      <a href="#" class="refresh" @click="getStackTrace">Refresh</a>
    </header>

    <pre
      v-if="stackTrace && stackTrace.payloads !== undefined"
      class="stack-trace-view"
      >{{ stackTrace.payloads }}</pre
    >

    <span class="error" v-if="stackTrace && stackTrace.error">
      {{ stackTrace.error }}
    </span>
    <span v-if="!isWorkerRunning" class="no-queries">
      There are no Workers currently listening to the Task List:
      <router-link
        :to="{
          name: 'task-list',
          params: {
            clusterName,
            taskList: taskListName,
          },
        }"
        >{{ taskListName }}
      </router-link>
    </span>
  </section>
</template>

<style lang="stylus">
@require "../../styles/definitions.styl"

section.stack-trace
  padding layout-spacing-small
  header
    margin-bottom layout-spacing-medium
  a.refresh
    margin 0 1em
    action-button()
    icon-refresh()

section .stack-trace-view
  white-space pre-wrap

span.no-queries {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 20px;
  color: uber-black-60;
}
</style>
