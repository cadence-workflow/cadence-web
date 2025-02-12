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

import ButtonIcon from './button-icon';

export default {
  name: 'highlight-toggle',
  props: {
    isHighlighted: {
      type: Boolean,
      default: false,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
    },
    tag: {
      type: String,
      default: 'div',
    },
  },
  components: {
    'button-icon': ButtonIcon,
  },
  methods: {
    onClick(...args) {
      if (this.isEnabled) {
        this.$emit('click', ...args);
      }
    },
  },
};
</script>

<template>
  <component class="highlight-toggle" :is="tag">
    <span class="label" :class="{ highlight: isHighlighted }">
      {{ label }}
    </span>
    <button-icon
      :class="{
        active: isHighlighted,
        disabled: !isEnabled,
      }"
      icon="icon_search"
      @click="onClick"
    />
  </component>
</template>

<style lang="stylus">
.highlight-toggle {
  line-height: 18px;

  &:hover {
    .button-icon {
      display: inline-block;
    }
  }

  .button-icon {
    display: none;
    min-width: 24px;
    padding: 0;

    &.active {
      display: inline-block;
    }

    &.disabled {
      display: none !important;
    }
  }

  .label.highlight {
    font-weight: bold;
  }
}
</style>
