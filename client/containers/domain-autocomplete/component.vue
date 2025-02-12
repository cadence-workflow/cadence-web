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

import { Autocomplete, FlexGrid, FlexGridItem } from '~components';

export default {
  name: 'domain-autocomplete',
  components: {
    'flex-grid': FlexGrid,
    'flex-grid-item': FlexGridItem,
    autocomplete: Autocomplete,
  },
  data() {
    return {
      value: undefined,
    };
  },
  props: {
    domain: {
      type: String,
    },
    domainList: {
      type: Array,
      default: () => [],
    },
    focus: {
      type: Boolean,
    },
    height: {
      type: String,
    },
    isLoading: {
      type: Boolean,
    },
    navigateToDomainUrl: {
      type: String,
    },
    search: {
      type: String,
    },
    width: {
      type: String,
    },
  },
  methods: {
    onAutocompleteChange(option) {
      this.$emit('onChange', option);
    },
    onAutocompleteSearch(search) {
      this.$emit('onSearch', search);
    },
  },
};
</script>

<template>
  <div class="domain-autocomplete" :style="{ width }">
    <flex-grid align-items="center">
      <flex-grid-item grow="1" margin="10px">
        <autocomplete
          empty-hint="Start typing to search for a domain."
          :focus="focus"
          :height="height"
          :is-loading="isLoading"
          :options="domainList"
          :placeholder="`${domain ? domain : 'cadence-canary'}`"
          :search="search"
          @change="onAutocompleteChange"
          @search="onAutocompleteSearch"
        />
      </flex-grid-item>
      <flex-grid-item width="32px">
        <span class="navigate-to-domain disabled" v-if="!navigateToDomainUrl" />
        <a
          class="navigate-to-domain"
          :href="navigateToDomainUrl"
          v-if="navigateToDomainUrl"
        />
      </flex-grid-item>
    </flex-grid>
  </div>
</template>

<style lang="stylus">
@require "../../styles/definitions"
@require "../../styles/base.styl"

.domain-autocomplete {
  color: #000;
  width: 100%;

  .navigate-to-domain {
    icon('\ea87');

    &.disabled::before {
      opacity: 0.25;
    }

    &::before {
      background-color: primary-color;
      border-radius: 32px;
      color: white;
      display: inline-block;
      height: 32px;
      line-height: 32px;
      text-align: center;
      width: 32px;
    }
  }
}
</style>
