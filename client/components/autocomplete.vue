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

import VueSelect from 'vue-select';

export default {
  name: 'autocomplete',
  components: {
    'v-select': VueSelect,
  },
  props: {
    emptyHint: {
      type: String,
      default: 'Start typing to search.',
    },
    focus: {
      type: Boolean,
    },
    height: {
      type: String,
      default: 'normal',
      validator: value => ['normal', 'slim'].indexOf(value) !== -1,
    },
    isLoading: {
      type: Boolean,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
    },
  },
  mounted() {
    const { focus } = this;

    if (focus) {
      this.focusAutocomplete();
    }
  },
  methods: {
    focusAutocomplete() {
      const { autocomplete } = this.$refs;

      autocomplete.searchEl.focus();
    },
    onSelectChange(...args) {
      this.$emit('change', ...args);
    },
    onSelectSearch(...args) {
      this.$emit('search', ...args);
    },
  },
  watch: {
    focus(focus) {
      if (focus) {
        this.focusAutocomplete();
      }
    },
  },
};
</script>

<template>
  <div
    class="autocomplete"
    :class="{ [height]: height, loading: isLoading, ready: !isLoading }"
  >
    <v-select
      :clear-search-on-blur="() => false"
      :filterable="false"
      :loading="isLoading"
      :multiple="multiple"
      :options="options"
      :placeholder="placeholder"
      ref="autocomplete"
      :searchable="true"
      @input="onSelectChange"
      @search="onSelectSearch"
    >
      <template v-slot:no-options="{ search, searching }">
        <template v-if="searching">
          No results found for <em>"{{ search }}"</em>.
        </template>
        <em class="empty-hint" v-else>{{ emptyHint }}</em>
      </template>
    </v-select>
  </div>
</template>

<style lang="stylus">
@require "../styles/definitions"
@require "../styles/base.styl"

.autocomplete {
  width: 100%;

  &.normal .v-select  {
    input[type=search], input[type=search]:focus {
      height: 42px;
      line-height: 24px;
      padding: 8px 18px;
    }
  }

  &.slim .v-select {
    input[type=search], input[type=search]:focus {
      height: 26px;
      line-height: 20px;
      padding: 8px 18px;
    }
  }

  .empty-hint {
    opacity: 0.5;
  }

  .v-select {
    background-color: white;
    color: text-color;
    font-family: inherit;

    .vs__dropdown-toggle {
      border: input-border;
      border-radius: 0;

      &.vs__open {
        border-color: uber-blue;
      }

      .vs__clear {
        bottom: 6px;
        right: 12px;
      }
    }

    input[type=search]::placeholder {
      color: uber-white-120
    }

    .vs__open-indicator {
      display: none !important;
    }

    .vs__selected {
      height: 42px;
      line-height: 24px;
      margin: 0;
      padding: 8px 18px;
    }

    .vs__spinner {
      top: 9px;
    }

    ul.vs__dropdown-menu {
      max-height: initial !important;
      overflow: auto;
      border: input-border;
      box-shadow: none;
      padding: 0;

      li {
        line-height: 2.5em;
        transition: none;

        &.vs__dropdown-option--highlight {
          background-color: uber-blue;
        }

        .vs__active > a {
          color: #333;
          background: rgba(50, 50, 50, .1);
        }
      }
    }
  }
}
</style>
