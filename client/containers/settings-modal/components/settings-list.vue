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

import { ButtonFill, FlexGrid, FlexGridItem } from '~components';

export default {
  name: 'settings-list',
  props: {
    activeViewName: {
      type: String,
    },
    viewList: {
      type: Array,
    },
  },
  methods: {
    onClick(view) {
      if (view.name !== this.activeViewName) {
        this.$emit('change', { view });
      }
    },
  },
  components: {
    'button-fill': ButtonFill,
    'flex-grid': FlexGrid,
    'flex-grid-item': FlexGridItem,
  },
};
</script>

<template>
  <flex-grid class="settings-list" flex-direction="column">
    <flex-grid-item v-for="view in viewList" :key="view.name" margin="0">
      <button-fill
        class="settings-list-item"
        :color="view.name === activeViewName ? 'primary' : 'tertiary'"
        :label="view.displayName"
        @click="() => onClick(view)"
      />
    </flex-grid-item>
  </flex-grid>
</template>

<style lang="stylus">
.settings-list {
  background-color: #fafafa;
  height: 100%;

  .settings-list-item {
    padding: 10px 40px 10px 15px;;
    text-align: left;
    width: 100%;
  }
}
</style>
