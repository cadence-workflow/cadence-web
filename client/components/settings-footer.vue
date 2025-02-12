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

import ButtonFill from './button-fill';
import FlexGrid from './flex-grid';
import FlexGridItem from './flex-grid-item';

export default {
  name: 'settings-footer',
  props: {
    submitEnabled: {
      type: Boolean,
    },
  },
  methods: {
    onCancelClick() {
      this.$emit('cancel');
    },
    onSubmitClick() {
      this.$emit('submit');
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
  <flex-grid align-items="center" justify-content="flex-end">
    <flex-grid-item width="102px">
      <button-fill color="tertiary" label="CANCEL" @click="onCancelClick" />
    </flex-grid-item>
    <flex-grid-item>
      <button-fill
        :disabled="!submitEnabled"
        label="APPLY"
        @click="onSubmitClick"
      />
    </flex-grid-item>
  </flex-grid>
</template>
