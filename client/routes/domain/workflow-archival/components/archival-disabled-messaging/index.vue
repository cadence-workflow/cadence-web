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

import {
  isHistoryArchivalEnabled,
  isVisibilityArchivalEnabled,
  replaceDomain,
} from '../../helpers';
import {
  archivalDisabledMessage,
  historyArchivalDisabledMessage,
  historyArchivalEnableCommand,
  historyArchivalLinks,
  visibilityArchivalDisabledMessage,
  visibilityArchivalEnableCommand,
} from './constants';

export default {
  name: 'archival-disabled-messaging',
  props: ['domainSettings'],
  data() {
    return {
      archivalDisabledMessage,
      historyArchivalDisabledMessage,
      historyArchivalLinks,
      visibilityArchivalDisabledMessage,
    };
  },
  computed: {
    isHistoryArchivalEnabled() {
      return isHistoryArchivalEnabled(this.domainSettings);
    },
    isVisibilityArchivalEnabled() {
      return isVisibilityArchivalEnabled(this.domainSettings);
    },
    historyArchivalEnableCommand() {
      return replaceDomain(historyArchivalEnableCommand, this.domainSettings);
    },
    visibilityArchivalEnableCommand() {
      return replaceDomain(
        visibilityArchivalEnableCommand,
        this.domainSettings
      );
    },
  },
};
</script>

<template>
  <div class="archival-disabled-messaging">
    <div class="message-group">
      <p v-for="(message, index) in archivalDisabledMessage" :key="index">
        {{ message }}
      </p>
      <div v-if="historyArchivalLinks">
        <div v-for="(link, index) in historyArchivalLinks" :key="index">
          <a :href="link.href" rel="noopener noreferrer" target="_blank">
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
    <div v-if="!isHistoryArchivalEnabled" class="message-group">
      <p>
        {{ historyArchivalDisabledMessage }}
      </p>
      <div v-if="historyArchivalEnableCommand">
        <pre>{{ historyArchivalEnableCommand }}</pre>
      </div>
    </div>
    <div v-if="!isVisibilityArchivalEnabled" class="message-group">
      <p>
        {{ visibilityArchivalDisabledMessage }}
      </p>
      <div v-if="visibilityArchivalEnableCommand">
        <pre>{{ visibilityArchivalEnableCommand }}</pre>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.archival-disabled-messaging {
  padding: 10px 50px;

  .message-group {
    margin: 20px 0;
  }

  a {
    font-size: 20px;
    line-height: 36px;
  }

  p {
    font-size: 20px;
    line-height: 36px;
  }

  pre {
    display: inline-block;
  }
}
</style>
