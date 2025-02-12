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

import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import { PendingTaskListItem } from './components';
import { PENDING_TASK_FILTERS } from './constants';
import { ButtonGroup, NoResults } from '~components';

export default {
  name: 'workflow-pending',
  data() {
    return {
      pendingTaskFilters: PENDING_TASK_FILTERS,
    };
  },
  props: {
    filter: {
      type: String,
      default: 'all',
    },
    emptyMessage: {
      type: String,
      default: 'No results',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    pendingTaskList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    'button-group': ButtonGroup,
    DynamicScroller,
    DynamicScrollerItem,
    'no-results': NoResults,
    'pending-task-list-item': PendingTaskListItem,
  },
};
</script>

<template>
  <div class="workflow-pending">
    <div class="top-navigation">
      <button-group
        :items="pendingTaskFilters"
        label="Filters"
        uppercase
        :value="filter"
        @change="$emit('filterChanged', $event)"
      />
    </div>
    <no-results
      :is-loading="isLoading"
      :message="emptyMessage"
      :results="pendingTaskList"
    />
    <div class="pending-task-list" v-if="pendingTaskList.length">
      <DynamicScroller
        key-field="pendingTaskId"
        :items="pendingTaskList"
        :min-item-size="38"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            class="scroller-item"
            :active="active"
            :data-active="active"
            :data-index="index"
            :item="item"
          >
            <pending-task-list-item :index="index" :item="item" />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
  </div>
</template>

<style lang="stylus">
.workflow-pending {
  .top-navigation {
    border-bottom: 1px solid #c6c6c6;
    box-shadow: 0 2px 2px rgba(0,0,0,0.2);
    padding: 24px;
  }

  .pending-task-list {
    max-height: calc(100vh - 191px);
    overflow-y: auto;
  }
}
</style>
