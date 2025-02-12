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

import PartitionTable from './components/partition-table';
import { FlexGrid, FlexGridItem } from '~components';
import { httpService } from '~services';

export default {
  name: 'partition',
  data() {
    return {
      activityPartitionList: undefined,
      decisionPartitionList: undefined,
    };
  },
  props: ['domain', 'taskList'],
  async created() {
    const partitions = await httpService.get(
      `/api/domains/${this.domain}/task-lists/${this.taskList}/partitions`
    );

    this.activityPartitionList = partitions.activityTaskListPartitions;
    this.decisionPartitionList = partitions.decisionTaskListPartitions;
  },
  components: {
    'flex-grid': FlexGrid,
    'flex-grid-item': FlexGridItem,
    'partition-table': PartitionTable,
  },
};
</script>

<template>
  <section class="task-list-partition">
    <flex-grid width="100%">
      <flex-grid-item grow="1" margin="10px">
        <partition-table
          title="Activity Partitions"
          :partition-list="activityPartitionList"
        />
      </flex-grid-item>
      <flex-grid-item grow="1">
        <partition-table
          title="Decision Partitions"
          :partition-list="decisionPartitionList"
        />
      </flex-grid-item>
    </flex-grid>
  </section>
</template>
