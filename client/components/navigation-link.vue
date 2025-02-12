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

export default {
  name: 'navigation-link',
  props: {
    exact: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    notificationCount: {
      type: Number,
      default: 0,
    },
    params: {
      type: Object,
    },
    to: {
      type: [String, Object],
    },
  },
};
</script>

<template>
  <router-link
    class="navigation-link"
    :class="icon"
    :exact="exact"
    :id="id"
    :params="params"
    :to="to"
  >
    <span>{{ label }}</span>
    <span class="notification" v-if="notificationCount">{{
      notificationCount
    }}</span>
  </router-link>
</template>

<style lang="stylus">
a.navigation-link {
  border-bottom: 4px solid transparent;
  display: inline-block;
  font-weight: 500;
  padding: 11px 18px;
  text-transform: uppercase;
  transition: all 400ms ease;

  &:before {
    font-family: 'uber-icons';
    margin-right: 5px;
  }

  &:focus, &:hover {
    border-bottom-color: #0e767b;
    outline: none;
  }

  &.router-link-active {
    border-bottom-color: #11939a;
  }

  & > .notification {
    background-color: #11939a;
    border-radius: 7px;
    color: black;
    font-size: 12px;
    margin-left: 5px;
    padding: 0 6px;
  }
}
</style>
