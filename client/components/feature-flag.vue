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

import { featureFlagService } from '~services';

export default {
  name: 'feature-flag',
  props: {
    allowDisabled: {
      type: Boolean,
      default: false,
    },
    display: {
      type: String,
      validator: value => ['inline', 'inline-block'].includes(value),
    },
    grow: {
      type: [String, Number],
    },
    margin: {
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    params: {
      type: Object,
    },
    width: {
      type: String,
    },
  },
  data() {
    return {
      isFeatureFlagEnabled: false,
      isLoading: true,
    };
  },
  async mounted() {
    const { name, params } = this;

    this.isFeatureFlagEnabled = await featureFlagService.isFeatureFlagEnabled({
      name,
      params,
    });
    this.isLoading = false;
  },
};
</script>

<template>
  <div
    class="feature-flag"
    :class="{
      [display]: display,
      enabled: isFeatureFlagEnabled,
      disabled: !isFeatureFlagEnabled,
    }"
    :style="{ flexGrow: grow, marginRight: margin, maxWidth: width }"
    v-if="!isLoading && (isFeatureFlagEnabled || allowDisabled)"
  >
    <slot v-if="isFeatureFlagEnabled"></slot>
    <slot name="enabled" v-if="isFeatureFlagEnabled"></slot>
    <slot name="disabled" v-if="!isFeatureFlagEnabled"></slot>
  </div>
</template>

<style lang="stylus">
.feature-flag {
  &.inline {
    display: inline;
  }
  &.inline-block {
    display: inline-block;
  }
}
</style>
