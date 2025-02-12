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
  props: ['clusterName', 'dateFormat', 'domain', 'timeFormat', 'timezone'],
  components: {
    'feature-flag': FeatureFlag,
    'navigation-bar': NavigationBar,
    'navigation-link': NavigationLink,
  },
};
</script>

<template>
  <section class="domain">
    <navigation-bar>
      <navigation-link
        icon="icon_search"
        label="Workflows"
        :to="{ name: 'workflow-list', params: { clusterName } }"
      />
      <navigation-link
        label="Settings"
        icon="icon_settings"
        :to="{ name: 'domain-settings', params: { clusterName } }"
      />
      <feature-flag display="inline" name="domainMetrics">
        <navigation-link
          label="Metrics"
          icon="icon_chart"
          :to="{ name: 'domain-metrics', params: { clusterName } }"
        />
      </feature-flag>
      <navigation-link
        label="Archival"
        icon="icon_trip-history"
        :to="{ name: 'workflow-archival', params: { clusterName } }"
      />
    </navigation-bar>
    <router-view
      name="workflow-list"
      :cluster-name="clusterName"
      :date-format="dateFormat"
      :domain="domain"
      :time-format="timeFormat"
      :timezone="timezone"
    />
    <router-view
      name="domain-settings"
      :cluster-name="clusterName"
      :domain="domain"
    />
    <router-view
      name="domain-metrics"
      :cluster-name="clusterName"
      :domain="domain"
    />
    <router-view
      name="workflow-archival"
      :cluster-name="clusterName"
      :date-format="dateFormat"
      :domain="domain"
      :time-format="timeFormat"
      :timezone="timezone"
    />
  </section>
</template>

<style lang="stylus">
section.domain {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow-y: auto;
}
</style>
