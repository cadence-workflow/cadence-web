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

import { FeatureFlag, SelectInput } from '~components';

export default {
  name: 'active-status',
  props: {
    classname: {
      type: String,
    },
    crossRegion: {
      type: Boolean,
    },
    cluster: {
      type: Object,
    },
    isReady: {
      type: Boolean,
    },
    label: {
      type: String,
    },
    selectList: {
      type: Array,
    },
    tag: {
      type: String,
    },
  },
  components: {
    'feature-flag': FeatureFlag,
    'select-input': SelectInput,
  },
  methods: {
    onClusterChange(cluster) {
      this.$emit('change', cluster);
    },
  },
};
</script>

<template>
  <feature-flag name="crossRegion.activeStatusTag" v-if="crossRegion">
    <component
      class="active-status"
      :class="{
        [classname]: classname,
      }"
      :is="tag"
      name="activeStatus"
      :options="selectList"
      :value="cluster"
      v-if="isReady && cluster"
      @change="onClusterChange"
    >
      {{ label }}
    </component>
  </feature-flag>
</template>

<style lang="stylus">
@require "../../styles/definitions"

span.active-status {
  color: white;
}

.active-status {
  color: #000;
  padding: 5px 10px;
  text-transform: uppercase;

  &.active {
    background-color: uber-green;
  }

  &.passive {
    background-color: uber-blue;
  }

  &.select-input {
    padding: 0;

    .v-select {
      .vs__dropdown-toggle {
        border: none;
        padding: 0;
      }

      span.vs__selected {
        color: white;
        margin: 0;
        padding: 0;
      }
    }

    .vs__actions {
      height: 24px;
      padding-top: 3px;
    }

    .vs__dropdown-option {
      padding: 0 10px;
    }

    .vs__open-indicator {
      fill: white;
      height: 10px;
    }

    .vs__selected-options {
      padding: 0 4px 0 8px;
    }
  }
}
</style>
