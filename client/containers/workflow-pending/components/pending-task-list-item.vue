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

import { DetailList } from '~components';

export default {
  name: 'pending-task-list-item',
  props: {
    index: {
      type: Number,
      default: 0,
    },
    item: {
      type: Object,
      default: () => ({
        kvps: [],
        pendingTaskTypeDisplay: '',
      }),
    },
  },
  components: {
    'detail-list': DetailList,
  },
};
</script>

<template>
  <div class="pending-task-list-item" :class="{ odd: index % 2 === 1 }">
    <div class="col type">{{ item.pendingTaskTypeDisplay }}</div>
    <div class="col detail">
      <detail-list :item="item" />
    </div>
  </div>
</template>

<style lang="stylus">
.pending-task-list-item {
  display: flex;

  &.odd {
    background-color: #f8f8f9;
  }

  .col {
    padding: 8px;

    &.type {
      width: 200px;
    }

    &.detail {
      flex: 1;
    }
  }
}
</style>
