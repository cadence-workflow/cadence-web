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

import ButtonFill from './button-fill';

export default {
  name: 'button-group',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
    },
    uppercase: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
  },
  components: {
    'button-fill': ButtonFill,
  },
  methods: {
    onClick(item) {
      if (this.value !== item) {
        this.$emit('change', item);
      }
    },
  },
};
</script>

<template>
  <div class="button-group">
    <span class="label" v-if="label">
      {{ label }}
    </span>
    <button-fill
      :active="item === value"
      :key="item"
      :label="item"
      :uppercase="uppercase"
      v-for="item in items"
      @click="() => onClick(item)"
    />
  </div>
</template>

<style lang="stylus">
.button-group {
  display: inline-block;

  .label {
    margin-right: 10px;
  }
}
</style>
