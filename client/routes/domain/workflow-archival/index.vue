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

import DomainService from '../domain-service';
import { isArchivalEnabled } from './helpers';
import { ArchivalDisabledMessaging } from './components';

export default {
  name: 'workflow-archival',
  props: ['clusterName', 'dateFormat', 'domain', 'timeFormat', 'timezone'],
  data() {
    return {
      domainSettings: {},
      loading: true,
    };
  },
  async created() {
    const domainService = DomainService();

    this.domainSettings = await domainService.getDomainSettings(this.domain);
    this.loading = false;
  },
  computed: {
    isArchivalEnabled() {
      return isArchivalEnabled(this.domainSettings);
    },
  },
  components: {
    'archival-disabled-messaging': ArchivalDisabledMessaging,
  },
};
</script>

<template>
  <section class="workflow-archival" :class="{ loading }">
    <archival-disabled-messaging
      v-if="!loading && !isArchivalEnabled"
      :domain-settings="domainSettings"
    />
    <router-view
      name="workflow-archival-advanced"
      v-if="!loading && isArchivalEnabled"
      :cluster-name="clusterName"
      :date-format="dateFormat"
      :domain="domain"
      :timeFormat="timeFormat"
      :timezone="timezone"
    />
    <router-view
      name="workflow-archival-basic"
      v-if="!loading && isArchivalEnabled"
      :cluster-name="clusterName"
      :date-format="dateFormat"
      :domain="domain"
      :timeFormat="timeFormat"
      :timezone="timezone"
    />
  </section>
</template>

<style lang="stylus">
section.workflow-archival {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  overflow-y: auto;
}
</style>
