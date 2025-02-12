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

import { NavigationBar, NavigationLink } from '~components';

export default {
  components: {
    'navigation-bar': NavigationBar,
    'navigation-link': NavigationLink,
  },
  methods: {
    onNotification(event) {
      this.$emit('onNotification', event);
    },
    onWorkflowHistoryEventParamToggle(event) {
      this.$emit('onWorkflowHistoryEventParamToggle', event);
    },
  },
};
</script>

<template>
  <section class="window">
    <navigation-bar>
      <navigation-link
        :exact="true"
        icon="icon_search"
        label="Domains"
        :to="{ name: 'domain-search' }"
      />
      <navigation-link
        label="News"
        icon="icon_messages"
        :to="{ name: 'news' }"
      />
      <navigation-link label="Help" icon="icon_help" :to="{ name: 'help' }" />
    </navigation-bar>
    <router-view
      name="domain-search"
      @onNotification="onNotification"
      @onWorkflowHistoryEventParamToggle="onWorkflowHistoryEventParamToggle"
    />
    <router-view name="help" @onNotification="onNotification" />
    <router-view name="news" @onNotification="onNotification" />
  </section>
</template>

<style lang="stylus">
.window {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
