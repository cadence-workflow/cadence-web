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

export default {
  name: 'button-icon',
  props: {
    color: {
      type: String,
      validator: value => ['primary', 'secondary'].includes(value),
    },
    disabled: {
      type: Boolean,
    },
    href: {
      type: String,
    },
    icon: {
      type: String,
    },
    label: {
      type: String,
    },
    size: {
      type: String,
      default: '14px',
    },
    tag: {
      type: String,
      default: 'button',
    },
    to: {
      type: Object,
    },
    width: {
      type: String,
      default: '44px',
    },
  },
  methods: {
    onClick(...args) {
      if (!this.disabled) {
        this.$emit('click', ...args);
      }
    },
  },
};
</script>

<template>
  <component
    :aria-disabled="disabled"
    class="button-icon"
    :class="{ disabled: disabled }"
    :disabled="disabled"
    :href="href"
    :is="tag"
    :style="{ 'min-width': width }"
    :to="to"
    @click="onClick"
  >
    <span
      class="icon"
      :class="{ [icon]: icon, [color]: color }"
      :style="{ 'font-size': size }"
    />
    <span class="label" :class="{ [color]: color }" v-if="label">{{
      label
    }}</span>
  </component>
</template>

<style lang="stylus">
.button-icon {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: inline-block;
  font-weight: 500;
  padding: 10px;
  transition: all 400ms ease;
  white-space: nowrap;

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon {
    vertical-align: middle;
  }

  .label {
    margin-left: 5px;
  }

  .primary {
    color: #11939a;
  }

  .secondary {
    color: #ca3b27;
  }
}
</style>
