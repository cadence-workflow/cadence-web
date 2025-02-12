<script>
// Modifications Copyright (c) 2021-2025 Uber Technologies Inc.
// Copyright (c) 2020-2024 Temporal Technologies, Inc.
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

import { RecycleScroller } from 'vue-virtual-scroller';
import NoResults from './no-results';

export default {
  name: 'workflow-grid',
  props: ['workflows', 'loading', 'noResultsText'],
  data() {
    return {
      nextPageToken: undefined,
    };
  },
  methods: {
    onScroll(startIndex, endIndex) {
      if (!this.workflows || endIndex < this.workflows.length) {
        return;
      }

      this.$emit('onScroll', startIndex, endIndex);
    },
  },
  computed: {
    anyWorkflows() {
      return this.workflows && this.workflows.length > 0;
    },
  },
  components: {
    RecycleScroller,
    'no-results': NoResults,
  },
};
</script>

<template>
  <section class="workflow-grid-wrapper" :class="{ loading }">
    <div class="row-header">
      <div class="col col-id">Workflow ID</div>
      <div class="col col-link">Run ID</div>
      <div class="col col-name">Name</div>
      <div class="col col-status">Status</div>
      <div class="col col-start">Start Time</div>
      <div class="col col-end">End Time</div>
    </div>
    <div class="spacer" />
    <no-results :results="workflows" v-if="!loading" :message="noResultsText" />
    <RecycleScroller
      key-field="uniqueId"
      :items="workflows"
      :item-size="56"
      emit-update
      @update="onScroll"
      ref="workflowGrid"
      data-cy="workflow-list"
      class="workflow-grid results"
      v-if="anyWorkflows"
      v-slot="{ item, index }"
    >
      <div class="row" :class="{ odd: index % 2 === 1 }">
        <div class="col col-id">{{ item.workflowId }}</div>
        <div class="col col-link">
          <router-link
            :to="{
              name: 'workflow/summary',
              params: {
                clusterName: item.clusterName,
                domain: item.domainName,
                runId: item.runId,
                workflowId: item.workflowId,
              },
            }"
            data-cy="workflow-link"
            >{{ item.runId }}
          </router-link>
        </div>
        <div class="col col-name">{{ item.workflowName }}</div>
        <div class="col col-status" :class="item.status">{{ item.status }}</div>
        <div class="col col-start">{{ item.startTime }}</div>
        <div class="col col-end">{{ item.endTime }}</div>
      </div>
    </RecycleScroller>
  </section>
</template>

<style lang="stylus">
@require "../styles/definitions.styl";

paged-grid();

.workflow-grid-wrapper{
  display: flex;
  flex:1;
  flex-direction: column;
  min-width: 1000px;
  &.loading.has-results::after {
    content: none;
  }

  .row-header {
    display: flex;
    position: relative;
    padding: 0 1rem;
    flex-direction: row;
    justify-content: start;
    align-items: stretch;

    color: rgb(0, 0, 0);
    font-weight: 500;
    text-transform: uppercase;

    box-shadow: 0px 2px 2px rgba(0,0,0,0.2);
    width: calc(100% - 10px);
  }

  .row {
    height: 56px;
    padding: 0 1rem;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: stretch;
    line-height: 1.2rem;

    &.odd {
      background-color: uber-white-10;
    }

    .col.col-status {
      text-transform: capitalize;
    }
  }


  .col {
    align-self: center;
    flex-basis: auto;
    padding: 0.5rem;

    &.col-id {
      flex: 1;
      word-break: break-all;
    }

    &.col-link {
      width: 300px;
    }

    &.col-name {
      flex: 1;
      word-break: break-all;
    }

    &.col-status {
      width: 150px;

      &.completed {
        color: uber-green;
      }

      &.failed {
        color: uber-orange;
      }

      &.running {
        color: uber-blue-120;
      }
    }

    &.col-start {
      width: 170px;
    }

    &.col-end {
      width: 170px;
    }
  }
}
.workflow-grid {
  flex:1 1 400px;
}
</style>
