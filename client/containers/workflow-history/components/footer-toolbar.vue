<script>
// Copyright (c) 2021-2025 Uber Technologies Inc.
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

import { ButtonFill } from '~components';

export default {
  name: 'footer-toolbar',
  props: {
    clusterName: {
      type: String,
    },
    pendingTaskCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    pendingTasksButtonDisabled() {
      const { pendingTaskCount } = this;

      return pendingTaskCount === 0;
    },
    pendingTasksButtonLabel() {
      const { pendingTaskCount } = this;

      return `${pendingTaskCount} PENDING TASK${
        pendingTaskCount === 1 ? '' : 'S'
      }`;
    },
  },
  components: {
    'button-fill': ButtonFill,
  },
};
</script>

<template>
  <div class="footer-toolbar">
    <button-fill
      :disabled="pendingTasksButtonDisabled"
      disabled-label="No pending tasks"
      :label="pendingTasksButtonLabel"
      size="small"
      tag="router-link"
      :to="{
        name: 'workflow/pending',
        params: { clusterName },
      }"
    />
  </div>
</template>

<style lang="stylus">
.footer-toolbar {
  background-color: #f8f8f9;
  box-shadow: 0 -2px 2px rgba(0, 0, 0, 0.2);
  padding: 6px 12px 6px 55px;
  position: relative;
}
</style>
