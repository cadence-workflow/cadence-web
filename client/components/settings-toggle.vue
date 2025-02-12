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

import { ToggleButton } from 'vue-js-toggle-button';
import FlexGrid from './flex-grid';
import FlexGridItem from './flex-grid-item';

export default {
  name: 'settings-toggle',
  props: {
    label: {
      type: String,
    },
    name: {
      type: String,
    },
    value: {
      type: Boolean,
    },
  },
  methods: {
    onChange(event) {
      const { name } = this;

      this.$emit('change', { ...event, name });
    },
  },
  components: {
    'flex-grid': FlexGrid,
    'flex-grid-item': FlexGridItem,
    'toggle-button': ToggleButton,
  },
};
</script>

<template>
  <flex-grid class="settings-toggle" align-items="center">
    <flex-grid-item grow="1">
      <label :for="name">
        {{ label }}
      </label>
    </flex-grid-item>
    <flex-grid-item>
      <toggle-button
        :labels="true"
        :name="name"
        :value="value"
        @change="onChange"
      />
    </flex-grid-item>
  </flex-grid>
</template>

<style lang="stylus">
.settings-toggle {
  height: 22px;
}
</style>
