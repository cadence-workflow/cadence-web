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

import { FeatureFlag, NavigationBar, NavigationLink } from '~components';

export default {
  props: [
    'clusterName',
    'dateFormat',
    'domain',
    'taskList',
    'timeFormat',
    'timezone',
  ],
  components: {
    'feature-flag': FeatureFlag,
    'navigation-bar': NavigationBar,
    'navigation-link': NavigationLink,
  },
};
</script>

<template>
  <section class="task-list">
    <navigation-bar>
      <navigation-link
        icon="icon_eta"
        label="Pollers"
        :to="{
          name: 'task-list/pollers',
          params: { clusterName },
        }"
      />
      <feature-flag display="inline" name="taskListPartition">
        <navigation-link
          icon="icon_fare-split"
          label="Partition"
          :to="{
            name: 'task-list/partition',
            params: { clusterName },
          }"
        />
      </feature-flag>
      <feature-flag display="inline" name="taskListMetrics">
        <navigation-link
          icon="icon_chart"
          label="Metrics"
          :to="{
            name: 'task-list/metrics',
            params: { clusterName },
          }"
        />
      </feature-flag>
    </navigation-bar>
    <router-view
      name="pollers"
      :date-format="dateFormat"
      :domain="domain"
      :task-list="taskList"
      :time-format="timeFormat"
      :timezone="timezone"
    />
    <router-view name="partition" :domain="domain" :task-list="taskList" />
    <router-view name="metrics" :domain="domain" :task-list="taskList" />
  </section>
</template>

<style lang="stylus">
section.task-list {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow-y: auto;
}
</style>
